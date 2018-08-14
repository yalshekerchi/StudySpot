const mongoose = require('mongoose');
const moment = require('moment');

const Building = mongoose.model('Building');
const Room = mongoose.model('Room');
const ClassSlot = mongoose.model('ClassSlot');

module.exports = (app) => {
  app.get('/api/buildings', async (req, res) => {
    try {
      const buildings = await Building.find({})
        .populate('rooms', { roomNumber: true })
        .exec();

      if (!buildings.length) {
        throw Error('No buildings found!');
      }

      return res.send(buildings);
    } catch (err) {
      return res.status(404).send(err);
    }
  });

  app.get('/api/buildings/:buildingCode', async (req, res) => {
    const { buildingCode } = req.params;

    try {
      const building = await Building.findOne({ buildingCode })
        .populate('rooms', { roomNumber: true })
        .exec();

      if (!building) {
        throw Error('Building not found!');
      }

      return res.send(building);
    } catch (err) {
      return res.status(404).send(err);
    }
  });

  app.get('/api/buildings/:buildingCode/rooms', async (req, res) => {
    const { buildingCode } = req.params;

    try {
      const building = await Building.findOne({ buildingCode })
        .select({ rooms: false })
        .exec();

      if (!building) {
        throw Error('Building not found!');
      }

      const rooms = await Room.find({ building: building.id })
        .populate({
          path: 'classes',
          select: { room: false, building: false },
          populate: {
            path: 'section',
            select: { classes: false }
          }
        })
        .exec();

      if (!rooms.length) {
        throw Error('No rooms found!');
      }

      return res.send(rooms);
    } catch (err) {
      return res.status(404).send(err);
    }
  });

  app.get('/api/buildings/:buildingCode/rooms/:roomNumber', async (req, res) => {
    const { buildingCode, roomNumber } = req.params;

    try {
      const building = await Building.findOne({ buildingCode })
        .select({ rooms: false })
        .exec();

      if (!building) {
        throw Error('Building not found!');
      }

      const room = await Room.findOne({ building: building.id })
        .populate({
          path: 'classes',
          select: { room: false, building: false },
          populate: {
            path: 'section',
            select: { classes: false }
          }
        })
        .exec();

      if (!room) {
        throw Error('Room not found!');
      }

      return res.send(room);
    } catch (err) {
      return res.status(404).send(err);
    }
  });

  app.post('/api/search/buildings', async (req, res) => {
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
          buildingCode: {
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
                { startTime: { $gte: startTime } },
                { endTime: { $gte: startTime } }
              ]
            },
            {
              $or: [
                { startTime: { $lte: endTime } },
                { endTime: { $lte: endTime } }
              ]
            }
          ]
        })
        .exec();

      const emptyRoomsResult = selectedBuildings.map((building) => {
        const modifiedBuilding = building;
        modifiedBuilding.rooms = building.rooms.filter(room => !occupiedClassSlots.some(classSlot => classSlot.room.equals(room._id)));
        return modifiedBuilding;
      });

      return res.send(emptyRoomsResult);
    } catch (err) {
      return res.status(404).send(err);
    }
  });
};
