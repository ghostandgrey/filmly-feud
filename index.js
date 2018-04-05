const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./models/movie');

mongoose.connect('mongodb://192.168.30.193:27017/imdb');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error while connecting to 192.168.36.243:27018/test:'));
db.once('open', function() {
  console.log('connected!');
});

const app = express();

app.get('/', (req, res) => res.send('Hello world'));

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/question', async (req, res) => {
  const MIN_YEAR = 1970;
  const MAX_YEAR = 2017;
  const releaseYear = getRandomInt(MIN_YEAR, MAX_YEAR);
  const answer = await getRandomMovieFromYear(releaseYear);

  var options = [];
  options.push(transformMovie(answer, true));
  for (var i = 0; i < 3; i++) {
    var otherReleaseYear = getRandomInt(MIN_YEAR, MAX_YEAR);
    if (otherReleaseYear === releaseYear) {
      otherReleaseYear--;
    }
    var wrongAnswer = await getRandomMovieFromYear(otherReleaseYear);
    options.push(transformMovie(wrongAnswer, false));
  }
  res.send({
    question: 'Which of these movies was released in ' + releaseYear + '?',
    options: options
  });
});

const getRandomMovieFromYear = async (releaseYear) => {
  const moviesInYear = await Movie.find({ titleType: 'movie', startYear: releaseYear});
  const numberOfMoviesInYear = moviesInYear.length;
  const randomMovie = getRandomInt(0, numberOfMoviesInYear - 1);
  return moviesInYear[randomMovie];
}

const transformMovie = (movie, isCorrect) => {
  return {
    tconst: movie.tconst,
    title: movie.primaryTitle,
    year: movie.startYear,
    answer: isCorrect
  };
}

const port = 3000;
app.listen(port, () => console.log('App started on port ' + port));
