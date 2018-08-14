const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Room Schema
const roomSchema = new Schema({
  roomNumber: String,
  building: { type: Schema.Types.ObjectId, ref: 'Building' },
  classes: [{ type: Schema.Types.ObjectId, ref: 'ClassSlot' }]
});

// First parameter is the name of the collection.
mongoose.model('Room', roomSchema);
