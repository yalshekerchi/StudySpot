const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Building Schema
const buildingSchema = new Schema({
  building_id: String,
  building_code: String,
  building_name: String,
  latitude: Number,
  longitude: Number,
  rooms: [{ type: Schema.Types.ObjectId, ref: 'room' }]
});

// First parameter is the name of the collection.
mongoose.model('Building', buildingSchema);
