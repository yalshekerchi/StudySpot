const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Section Schema
const sectionSchema = new Schema({
  subject: String,
  catalog_number: String,
  units: Number,
  title: String,
  note: String,
  class_number: Number,
  section: String,
  campus: String,
  associated_class: Number,
  topic: String,
  classes: [{ type: Schema.Types.ObjectId, ref: 'ClassDetail' }],
  term: Number
});

// First parameter is the name of the collection.
mongoose.model('Section', sectionSchema);
