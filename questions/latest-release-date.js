const mongoose = require('mongoose');
const Movie = require('../models/movie');

const db = mongoose.connection;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MIN_YEAR = 1970;
const MAX_YEAR = 2017;

const generateQuestion = async () => {
  console.log('Generating latest release date question');
  var releaseYears = {};
  var options = [];
  for (var i = 0; i < 4; i++) {
    var differentYear = false;
    var releaseYear;
    while (!differentYear) {
      releaseYear = getRandomInt(MIN_YEAR, MAX_YEAR);
      if (!releaseYears.hasOwnProperty(releaseYear.toString())) {
        releaseYears[releaseYear.toString()] = {};
        differentYear = true;
      }
    }
    const option = await getRandomMovieFromYear(releaseYear);
    options.push(transformMovie(option, false));
  }

  const years = options.map((movie) => Number(movie.year));
  const latestYear = years.reduce(getMax);
  const correctAnswer = options.find((movie) => movie.year == latestYear);
  correctAnswer.answer = true;
  return {
    question: 'Which of these movies was released most recently?',
    options: options
  }
}

const getMax = (max, cur) => {
  if (max > cur) {
    return max;
  }
  return cur;
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
