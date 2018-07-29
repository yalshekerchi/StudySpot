const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Room Schema
const roomSchema = new Schema({
  room_number: Number,
  building: { type: Schema.Types.ObjectId, ref: 'Building' },
  classes: { type: Schema.Types.ObjectId, ref: 'ClassDetail' }
});

// First parameter is the name of the collection.
mongoose.model('Room', roomSchema);
