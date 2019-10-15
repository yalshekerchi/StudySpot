const mongoose = require('mongoose');
const axios = require('axios');
const moment = require('moment');
const passport = require('passport');
const keys = require('../config/keys');

const Building = mongoose.model('Building');
const Room = mongoose.model('Room');
const Section = mongoose.model('Section');
const ClassSlot = mongoose.model('ClassSlot');

const UWATERLOO_URL = 'https://api.uwaterloo.ca/v2';

module.exports = app => {
  app.post(
    '/auth/scrape/:termId?',
    passport.authenticate('basic', { session: false }),
    async (req, res) => {
      let { termId } = req.params;
      if (!termId) {
        // Calculate current term code
        const currentMonth = moment().month(); // Zero-indexed
        const termStartMonth = 1 + Math.floor(currentMonth / 4) * 4;
        const termStartYear = moment().year() % 100;
        termId = `1${termStartYear}${termStartMonth}`;
      }

      console.log(`Term: ${termId}`);

      const subjectsReq = await axios.get(
        `${UWATERLOO_URL}/codes/subjects.json?key=${keys.uWaterlooAPI}`
      );

      /* eslint-disable no-restricted-syntax, no-await-in-loop */
      for (const subjectData of subjectsReq.data.data) {
        const schedulesReq = await axios.get(
          `${UWATERLOO_URL}/terms/${termId}/${subjectData.subject}/schedule.json?key=${keys.uWaterlooAPI}`
        );
        console.log('Requested Schedule for', subjectData.subject);

        // Iterate over all senctions for a particular subject
        for (const sectionData of schedulesReq.data.data) {
          // Create section if not in db
          let section = await Section.findOne({
            classNumber: sectionData.class_number
          });

          if (!section) {
            section = await new Section({
              subject: sectionData.subject,
              catalogNumber: sectionData.catalog_number,
              units: sectionData.units,
              title: sectionData.title,
              note: sectionData.note,
              classNumber: sectionData.class_number,
              section: sectionData.section,
              campus: sectionData.campus,
              associatedClass: sectionData.associated_class,
              topic: sectionData.topic,
              term: sectionData.term
            }).save();
            console.log(
              'Added Section:',
              section.subject,
              section.catalogNumber,
              section.section
            );
          }

          // Iterate over all classes for the section
          for (const classData of sectionData.classes) {
            // Verify that class has valid location
            if (classData.location.building) {
              // Create building if not in db
              let building = await Building.findOne({
                buildingCode: classData.location.building
              }).exec();

              if (!building) {
                // Fix invalid building names
                let buildingCodeOveride;
                switch (classData.location.building) {
                  case 'SJ1':
                    buildingCodeOveride = 'STJ-CB';
                    break;
                  case 'SJ2':
                    buildingCodeOveride = 'STJ-AC';
                    break;
                  default:
                    break;
                }

                const buildingReq = await axios.get(
                  `${UWATERLOO_URL}/buildings/${buildingCodeOveride ||
                    classData.location.building}.json?key=${keys.uWaterlooAPI}`
                );
                if (buildingReq.data.meta.status !== 200) {
                  console.log('Invalid Building:', classData.location.building);
                  console.log(buildingReq.data.meta);
                  continue;
                }

                building = await new Building({
                  buildingId: buildingReq.data.data.building_id,
                  buildingCode: classData.location.building,
                  buildingName: buildingReq.data.data.building_name,
                  latitude: buildingReq.data.data.latitude,
                  longitude: buildingReq.data.data.longitude
                }).save();
                console.log('Added Building:', building.buildingCode);
              }

              // Create room if not in db
              let room = await Room.findOne({
                roomNumber: classData.location.room,
                building: building.id
              });

              if (!room) {
                room = await new Room({
                  roomNumber: classData.location.room,
                  building: building.id
                }).save();
                // console.log('Added Room:', building.buildingCode, room.roomNumber);

                await Building.update(
                  { _id: building.id },
                  { $push: { rooms: room } }
                ).exec();
              }

              // Create class if not in db
              const days = classData.date.weekdays
                .match(/(M)*(T(?!h))*(W)*(Th)*(F)*/)
                .splice(1, 5);

              for (const day of days) {
                if (day) {
                  let classSlot = await ClassSlot.findOne({
                    // TODO: Optimize query
                    section: section.id,
                    startTime: moment(classData.date.start_time, 'HH:mm').diff(
                      moment().startOf('day'),
                      'seconds'
                    ),
                    endTime: moment(classData.date.end_time, 'HH:mm').diff(
                      moment().startOf('day'),
                      'seconds'
                    ),
                    day,
                    instructors: classData.instructors,
                    building: building.id,
                    room: room.id
                  });

                  if (!classSlot) {
                    classSlot = await new ClassSlot({
                      section: section.id,
                      startTime: moment(
                        classData.date.start_time,
                        'HH:mm'
                      ).diff(moment().startOf('day'), 'seconds'),
                      endTime: moment(classData.date.end_time, 'HH:mm').diff(
                        moment().startOf('day'),
                        'seconds'
                      ),
                      day,
                      instructors: classData.instructors,
                      building: building.id,
                      room: room.id
                    }).save();
                    // console.log('Added Class:', section.subject, section.catalogNumber, section.section, classSlot.day, classSlot.start_time, classSlot.end_time);

                    await Room.update(
                      { _id: room.id },
                      { $push: { classes: classSlot } }
                    ).exec();
                    await Section.update(
                      { _id: section.id },
                      { $push: { classes: classSlot } }
                    ).exec();
                  }
                }
              }
            }
          }
        }
      }
      console.log('Scraping Completed!');
      res.send({});
    }
  );

  app.post(
    '/auth/reset',
    passport.authenticate('basic', { session: false }),
    async (req, res) => {
      Building.collection.drop();
      ClassSlot.collection.drop();
      Room.collection.drop();
      Section.collection.drop();
      console.log('Dropped Collections!');
      res.send({});
    }
  );

  /* eslint-enable no-restricted-syntax, no-await-in-loop */
};
