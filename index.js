const express = require('express');
const mongoose = require('mongoose');
const releaseDateQuestion = require('./questions/movie-release-date');
const earliestReleaseDateQuestion = require('./questions/earliest-release-date');

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
  const selection = getRandomInt(0, 1);
  if (selection === 0) {
    const question = await releaseDateQuestion.generateQuestion();
    res.send(question);
  }
  else if (selection === 1) {
    const question = await earliestReleaseDateQuestion.generateQuestion();
    res.send(question);
  }
});

const port = 3000;
app.listen(port, () => console.log('App started on port ' + port));
