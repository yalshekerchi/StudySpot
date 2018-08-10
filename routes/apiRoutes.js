const mongoose = require('mongoose');
const moment = require('moment');

const Building = mongoose.model('Building');
const Room = mongoose.model('Room');
const ClassSlot = mongoose.model('ClassSlot');

module.exports = (app) => {
  app.get('/api/buildings', async (req, res) => {
    const buildings = await Building.find({})
      .select({
        buildingCode: true,
        buildingName: true,
        latitude: true,
        longitude: true,
      })
      .exec();

    return res.send(buildings);
  });

  app.get('/api/rooms', async (req, res) => {
    const { buildingCode } = req.headers;
    try {
      const building = await Building.findOne({ buildingCode }).exec();

      const rooms = await Room.find({ building: building.id })
        .populate('building', { rooms: false })
        .populate({
          path: 'classes',
          select: { section: true },
          populate: {
            path: 'section',
            select: { subject: true, catalogNumber: true, section: true }
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
