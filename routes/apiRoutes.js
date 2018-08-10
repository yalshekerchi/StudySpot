const mongoose = require('mongoose');
const moment = require('moment');

const Building = mongoose.model('Building');
const Room = mongoose.model('Room');
const ClassSlot = mongoose.model('ClassSlot');

module.exports = (app) => {
  app.get('/api/buildings', async (req, res) => {
    const buildings = await Building.find({})
      .select({
        building_code: true,
        building_name: true,
        latitude: true,
        longitude: true,
      })
      .exec();

    return res.send(buildings);
  });

  app.get('/api/rooms', async (req, res) => {
    const { building_code } = req.headers;
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

  app.post('/api/room_search', async (req, res) => {
    const {
      buildings,
      date,
      endTime,
      startTime
    } = req.body;

    console.log(req.body);

    let day = moment(date, 'YYYYMMDD').format('dd');
    day = day === 'Th' ? day : day[0];

    console.log(day);

    try {
      const selectedBuildings = await Building
        .find({
          building_code: {
            $in: buildings
          }
        })
        .populate('rooms')
        .exec();

      const occupiedClassSlots = await ClassSlot
        .find({
          day,
          $and: [
            {
              $or: [
                { start_time: { $gte: startTime } },
                { end_time: { $gte: startTime } }
              ]
            },
            {
              $or: [
                { start_time: { $lte: endTime } },
                { end_time: { $lte: endTime } }
              ]
            }
          ]
        })
        .exec();

      const emptyRoomsResult = selectedBuildings.map((building) => {
        const modifiedBuilding = building;
        modifiedBuilding.rooms = building.rooms.filter((room) => {
          return !occupiedClassSlots.some((classSlot) => {
            return classSlot.room.equals(room._id);
          });
        });
        return modifiedBuilding;
      });

      return res.send(emptyRoomsResult);
    } catch (err) {
      return res.status(404).send(err);
    }
  });
};
