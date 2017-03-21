const express = require('express');
const helpers = require('./helpers');
const http = require('http');

const places = helpers.importPlaces();
const app = express();

app.use(express.static('public'));

app.get('/searchPlaces', function (req, res) {
  const searchStr = req.query['q'];
  res.send(helpers.searchPlaces(searchStr, places));
});

app.get('/getWeather', function (req, res) {
  const id = Number.parseInt(req.query['id']);
  helpers
    .getWeather(id, places)
    .then(temp => res.send(temp));
});

var server = app.listen(8080, function () {
  console.log('listening')
});