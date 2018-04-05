const express = require('express');
const mongoose = require('mongoose');
const releaseDateQuestion = require('./questions/movie-release-date');
const earliestReleaseDateQuestion = require('./questions/earliest-release-date');
const latestReleaseDateQuestion = require('./questions/latest-release-date');
const genreQuestion = require('./questions/genre');
const Movie = require('./models/movie');

mongoose.connect('mongodb://192.168.30.193:27017/imdb');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error while connecting to 192.168.36.243:27018/test:'));
db.once('open', function() {
  console.log('connected!');
});

const app = express();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/question', async (req, res) => {
  const selection = getRandomInt(0, 2);
  var question;
  if (selection === 0) {
    question = await releaseDateQuestion.generateQuestion();
  }
  else if (selection === 1) {
    question = await earliestReleaseDateQuestion.generateQuestion();
  }
  else if (selection === 2) {
    question = await latestReleaseDateQuestion.generateQuestion();
  }
  else if (selection === 3) {
    question = await genreQuestion.generateQuestion();
  }
  question.options.sort((a, b) => 0.5 - Math.random());

  res.send(question);
});

app.get('/genres', async (req, res) => {

  var genres = new Set();

  const genresAsStrings = await Movie.find({titleType: 'movie'});
  genresAsStrings.forEach((movie) => {
    const movieGenres = movie.genres.split(',');
    movieGenres.forEach((genre) => {
      genres.add(genre);
    });
  });

  var finalGenres = [];
  genres.forEach((gen) => {
    finalGenres.push(gen);
  });
  finalGenres.sort();
  res.send(finalGenres);
});

const port = 3000;
app.listen(port, () => console.log('App started on port ' + port));
