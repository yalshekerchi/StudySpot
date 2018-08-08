const mongoose = require('mongoose');

const Building = mongoose.model('Building');
const Room = mongoose.model('Room');

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
};
