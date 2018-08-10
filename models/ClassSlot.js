const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define ClassSlot Schema
const classSlotSchema = new Schema({
  startTime: Number,
  endTime: Number,
  day: String,
  instructors: [String],
  building: { type: Schema.Types.ObjectId, ref: 'Building' },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  section: { type: Schema.Types.ObjectId, ref: 'Section' }
});

// First parameter is the name of the collection.
mongoose.model('ClassSlot', classSlotSchema);
