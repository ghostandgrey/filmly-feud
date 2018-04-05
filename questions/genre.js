const mongoose = require('mongoose');
const Movie = require('../models/movie');

const db = mongoose.connection;

const genres = [
   'Action',
   'Adult',
   'Adventure',
   'Animation',
   'Biography',
   'Comedy',
   'Crime',
   'Documentary',
   'Drama',
   'Family',
   'Fantasy',
   'Film-Noir',
   'Game-Show',
   'History',
   'Horror',
   'Music',
   'Musical',
   'Mystery',
   'News',
   'Reality-TV',
   'Romance',
   'Sci-Fi',
   'Short',
   'Sport',
   'Talk-Show',
   'Thriller',
   'War',
   'Western'
 ];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MIN_YEAR = 1970;
const MAX_YEAR = 2017;

const generateQuestion = async () => {
  console.log('Generating genre question');
  const releaseYear = getRandomInt(MIN_YEAR, MAX_YEAR);
  const movie = await getRandomMovieFromYear(releaseYear);

  var genreSet = new Set();
  genres.forEach((gen) => {
    genreSet.add(gen);
  });

  const movieGenres = movie.genres.split(',');
  movieGenres.forEach((genre) => {
    genreSet.delete(genre);
  });

  const correctGenre = movieGenres[getRandomInt(0, movieGenres.length - 1)];

  var options = [];

  options.push({
    tconst: movie.tconst,
    title: correctGenre,
    year: 0,
    answer: true
  });

  var wrongGenres = [];
  genreSet.forEach((gen) => {
    wrongGenres.push(gen);
  });

  var neededQuestions = 3;
  if (genreSet.has('Adult')) {
    options.push({
      tconst: movie.tconst,
      title: 'Adult',
      year: 0,
      answer: false
    });
    neededQuestions = 2;
  }

  var pickedSet = new Set();
  for (var i = 0; i < neededQuestions; i++) {
    var done = false;
    var pickedGenreIndex;
    while (!done) {
      pickedGenreIndex = getRandomInt(0, wrongGenres.length - 1);
      if (!pickedSet.has(pickedGenreIndex)) {
        pickedSet.add(pickedGenreIndex);
        done = true;
      }
    }
    options.push({
      tconst: movie.tconst,
      title: wrongGenres[pickedGenreIndex],
      year: 0,
      answer: false
    });
  }

  return {
    question: 'Which of these genres describes the movie: ' + movie.primaryTitle,
    options: options
  }
}

const getRandomMovieFromYear = async (releaseYear) => {
  const moviesInYear = await Movie.find({ titleType: 'movie', startYear: releaseYear});
  const numberOfMoviesInYear = moviesInYear.length;
  var done = false;
  var movie;
  while (!done) {
    const randomMovie = getRandomInt(0, numberOfMoviesInYear - 1);
    movie = moviesInYear[randomMovie];
    if (movie.genres !== '\N' && movie.genres !== '') {
      done = true;
    }
  }
  return movie;
}

module.exports = {generateQuestion: generateQuestion};
