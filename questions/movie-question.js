const mongoose = require('mongoose');
const Movie = require('../models/movie');

const db = mongoose.connection;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MIN_YEAR = 1970;
const MAX_YEAR = 2017;

const generateQuestion = async () => {
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
  return {
    question: 'Which of these movies was released in ' + releaseYear + '?',
    options: options
  }
}

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

module.exports = {generateQuestion: generateQuestion};
