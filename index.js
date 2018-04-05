const express = require('express');
const mongoose = require('mongoose');
const releaseDateQuestion = require('./questions/movie-release-date')

mongoose.connect('mongodb://192.168.30.193:27017/imdb');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error while connecting to 192.168.36.243:27018/test:'));
db.once('open', function() {
  console.log('connected!');
});

const app = express();

app.get('/', (req, res) => res.send('Hello world'));

app.get('/question', async (req, res) => {
  const question = await releaseDateQuestion.generateQuestion();
  res.send(question);
});

const port = 3000;
app.listen(port, () => console.log('App started on port ' + port));
