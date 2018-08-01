const _ = require('lodash');
const mongoose = require('mongoose');
const axios = require('axios');
const keys = require('../config/keys');

const Building = mongoose.model('Building');
const Room = mongoose.model('Room');
const Section = mongoose.model('Section');
const ClassDetail = mongoose.model('ClassDetail');

const UWATERLOO_URL = 'https://api.uwaterloo.ca/v2';
const term = '1189';

module.exports = (app) => {
  app.get('/scrape', async (req, res) => {
    const subjectsReq = await axios.get(`${UWATERLOO_URL}/codes/subjects.json?key=${keys.uWaterlooAPI}`);

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const subjectData of subjectsReq.data.data) {
      const schedulesReq = await axios.get(`${UWATERLOO_URL}/terms/${term}/${subjectData.subject}/schedule.json?key=${keys.uWaterlooAPI}`);
      console.log('Requested Schedule for', subjectData.subject);

      // Iterate over all senctions for a particular subject
      for (const sectionData of schedulesReq.data.data) {
        // Create section if not in db
        let section = await Section.findOne({
          class_number: sectionData.class_number,
        });

        if (!section) {
          section = await new Section({
            subject: sectionData.subject,
            catalog_number: sectionData.catalog_number,
            units: sectionData.units,
            title: sectionData.title,
            note: sectionData.note,
            class_number: sectionData.class_number,
            section: sectionData.section,
            campus: sectionData.campus,
            associated_class: sectionData.associated_class,
            topic: sectionData.topic,
            term: sectionData.term
          }).save();
          // console.log('Added Section:', sectionData.subject, sectionData.catalog_number, sectionData.section);
        }

        // Iterate over all classes for the section
        for (const classData of sectionData.classes) {
          // Verify that class has valid location
          if (classData.location.building) {
            // Create building if not in db
            let building = await Building.findOne({
              building_code: classData.location.building
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

              const buildingReq = await axios.get(`${UWATERLOO_URL}/buildings/${buildingCodeOveride || classData.location.building}.json?key=${keys.uWaterlooAPI}`);
              if (buildingReq.data.meta.status !== 200) {
                console.log('Invalid Building:', classData.location.building);
                console.log(buildingReq.data.meta);
                continue;
              }

              building = await new Building({
                building_id: buildingReq.data.data.building_id,
                building_code: classData.location.building,
                building_name: buildingReq.data.data.building_name,
                latitude: buildingReq.data.data.latitude,
                longitude: buildingReq.data.data.longitude,
              }).save();
              console.log('Added Building:', building.building_code);
            }

            // Create room if not in db
            let room = await Room.findOne({
              room_number: classData.location.room,
              building: building.id
            });

            if (!room) {
              room = await new Room({
                room_number: classData.location.room,
                building: building.id,
              }).save();
              // console.log('Added Room:', building.building_code, room.room_number);

              await Building.update({ _id: building.id }, { $push: { rooms: room } }).exec();
            }

            // Create class if not in db
            const re = /(M)*(T(?!h))*(W)*(Th)*(F)*/g;
            let classDetail = await ClassDetail.findOne({
              // TODO: Optimize query
              section: section.id,
              start_time: new Date(`1970-01-01T ${classData.date.start_time}`),
              end_time: new Date(`1970-01-01T ${classData.date.end_time}`),
              weekdays: {
                M: Boolean(classData.date.weekdays.replace(re, '$1')),
                T: Boolean(classData.date.weekdays.replace(re, '$2')),
                W: Boolean(classData.date.weekdays.replace(re, '$3')),
                Th: Boolean(classData.date.weekdays.replace(re, '$4')),
                F: Boolean(classData.date.weekdays.replace(re, '$5'))
              },
              instructors: classData.instructors,
              building: building.id,
              room: room.id
            });

            if (!classDetail) {
              classDetail = await new ClassDetail({
                section: section.id,
                start_time: new Date(`1970-01-01T ${classData.date.start_time}`),
                end_time: new Date(`1970-01-01T ${classData.date.end_time}`),
                weekdays: {
                  M: Boolean(classData.date.weekdays.replace(re, '$1')),
                  T: Boolean(classData.date.weekdays.replace(re, '$2')),
                  W: Boolean(classData.date.weekdays.replace(re, '$3')),
                  Th: Boolean(classData.date.weekdays.replace(re, '$4')),
                  F: Boolean(classData.date.weekdays.replace(re, '$5'))
                },
                instructors: classData.instructors,
                building: building.id,
                room: room.id
              }).save();
              // console.log('Added Class:', sectionData.subject, sectionData.catalog_number, sectionData.section, classData.date.weekday, classData.date.start_time, classData.date.end_time);

              await Room.update({ _id: room.id }, { $push: { classes: classDetail } }).exec();
              await Section.update({ _id: section.id }, { $push: { classes: classDetail } }).exec();
            }
          }
        }
      }
    }
    console.log('Scraping Completed!');
    res.send({});
  });
  /* eslint-enable no-restricted-syntax, no-await-in-loop */

  app.get('/api/rooms', async (req, res) => {
    const { building_code } = req.headers;
    console.log(req.headers);
    try {
      const building = await Building.findOne({ building_code }).exec();

      const rooms = await Room.find({ building: building.id })
        .populate('building', { rooms: false })
        .populate({
          path: 'classes',
          select: { section: true },
          populate: {
            path: 'section',
            select: { subject: true, catalog_number: true, section: true }
          }
        })
        .exec();

      return res.send(rooms);
    } catch (err) {
      return res.status(404).send(err);
    }
  });
};
