const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define ClassDetail Schema
const classDetailSchema = new Schema({
  start_time: String,
  end_time: String,
  weekdays: {
    M: Boolean,
    T: Boolean,
    W: Boolean,
    Th: Boolean,
    F: Boolean
  },
  instructors: [String],
  building: { type: Schema.Types.ObjectId, ref: 'Building' },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  section: { type: Schema.Types.ObjectId, ref: 'Section' }
});

// First parameter is the name of the collection.
mongoose.model('ClassDetail', classDetailSchema);
