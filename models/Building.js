const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Building Schema
const buildingSchema = new Schema({
  buildingId: String,
  buildingCode: String,
  buildingName: String,
  latitude: Number,
  longitude: Number,
  rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }]
});

// First parameter is the name of the collection.
mongoose.model('Building', buildingSchema);
