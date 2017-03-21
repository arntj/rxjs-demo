const csv = require('csv-parse/lib/sync');
const fs = require('fs');
const http = require('http');
const xml = require('xml2js');

const importPlaces = function () {
  return csv(fs.readFileSync('./noreg.txt'), { delimiter: '\t', relax_column_count: true });
}

const searchPlaces = function(searchStr, places) {
  const result = [];
  for (let i = 1; i < places.length; i++) {
    let curr = places[i];
    if (curr[1].toLowerCase().startsWith(searchStr.toLowerCase())) {
      result.push({
        id: i, // zero-based line number in the file
        name: curr[1],
        type: curr[3],
        municipality: curr[6],
        county: curr[7]
      });
    }
  }
  return result.slice(0, 5);
}

const getWeather = function(id, places) {
  const url = places[id][12];
  let str = '';
  return new Promise((resolve, reject) => {
    http.get(
          url,
          function (response) {
            response.on('data', function (chunk) {
              str += chunk;
            });
            response.on('end', function () {
              xml.parseString(str, (err, result) => {
                const tempStr = result.weatherdata.forecast[0].tabular[0].time[0].temperature[0].$.value;
                const temp = Number.parseInt(tempStr);
                const locationName = result.weatherdata.location[0].name[0];
                resolve({ id, temp, locationName });
              });
            })
          })
        .end();
  });
}

module.exports = {
  importPlaces,
  searchPlaces,
  getWeather
};