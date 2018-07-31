const _ = require('lodash');
const mongoose = require('mongoose');
const axios = require('axios');
const keys = require('../config/keys');

const Building = mongoose.model('Building');
const Room = mongoose.model('Room');
const ClassDetail = mongoose.model('ClassDetail');

const UWATERLOO_URL = 'https://api.uwaterloo.ca/v2';

module.exports = (app) => {
  app.get('/scrape', async (req, res) => {
    const subjectsReq = await axios.get(`${UWATERLOO_URL}/codes/subjects.json?key=${keys.uWaterlooAPI}`);

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const subjectData of subjectsReq.data.data) {
      const schedulesReq = await axios.get(`${UWATERLOO_URL}/terms/1185/${subjectData.subject}/schedule.json?key=${keys.uWaterlooAPI}`);
      console.log('Requested Schedule for ', subjectData.subject);

      // Iterate over all senctions for a particular subject
      for (const section of schedulesReq.data.data.splice(0, 10)) {
        // Iterate over all classes for the section
        for (const classInfo of section.classes) {
          // Verify that class has valid location
          if (classInfo.location.building) {
            // Create building if not in db
            console.log('Requested Building: ', classInfo.location.building);
            let building = await Building.findOne({
              building_code: classInfo.location.building
            }).exec();

            if (!building) {
              const buildingReq = await axios.get(`${UWATERLOO_URL}/buildings/${classInfo.location.building}.json?key=${keys.uWaterlooAPI}`);
              building = await new Building({
                building_id: buildingReq.data.data.building_id,
                building_code: buildingReq.data.data.building_parent || buildingReq.data.data.building_code,
                building_name: buildingReq.data.data.building_name,
                latitude: buildingReq.data.data.latitude,
                longitude: buildingReq.data.data.longitude,
              }).save();
              console.log('Added Building: ', building.building_code);
            }

            // Create room if not in db
            let room = await Room.findOne({
              room_number: classInfo.location.room,
              building: building.id
            });

            if (!room) {
              room = await new Room({
                room_number: classInfo.location.room,
                building: building.id,
              }).save();
              console.log('Added Room: ', building.building_code, room.room_number);

              await Building.update({ _id: building.id }, { $push: { rooms: room } }).exec();
            }

            // Create class if not in db
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
    const building = await Building.findOne({ building_code }).exec();

    const rooms = await Room.find({ building: building.id })
      .populate('building', { rooms: false })
      .exec();
    
    res.send(rooms);
  });
};
