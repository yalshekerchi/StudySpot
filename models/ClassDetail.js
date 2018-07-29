const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define ClassDetail Schema
const classDetailSchema = new Schema({
  class_number: Number,
  subject: String,
  catalog_number: String,
  title: String,
  section: String,
  weekdays: String,
  start_time: String,
  end_time: String,
  instructors: [String],
  building: { type: Schema.Types.ObjectId, ref: 'Building' },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  term: Number,
  last_updated: String,
});

// First parameter is the name of the collection.
mongoose.model('ClassDetail', classDetailSchema);
