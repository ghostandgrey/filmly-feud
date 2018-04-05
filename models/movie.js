const mongoose = require('mongoose');

module.exports = mongoose.model(
  'title_basics',
  mongoose.Schema({
    tconst: String,
    primaryTitle: String,
    titleType: String,
    startYear: Number
  })
);
