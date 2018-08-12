const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Section Schema
const sectionSchema = new Schema({
  subject: String,
  catalogNumber: String,
  units: Number,
  title: String,
  note: String,
  classNumber: Number,
  section: String,
  campus: String,
  associatedClass: Number,
  topic: String,
  classes: [{ type: Schema.Types.ObjectId, ref: 'ClassDetail' }],
  term: Number
});

// First parameter is the name of the collection.
mongoose.model('Section', sectionSchema);
