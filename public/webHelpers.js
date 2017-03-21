const webHelpers = {
  addPlaces: function (places) {
    const placeListElement = document.getElementById('place-list');
    placeListElement.innerHTML = '';
    for (let place of places) {
      const placeElement = document.createElement('div');
      placeElement.classList.add('place');
      placeElement.setAttribute('placeid', place.id);
      placeElement.innerText =
        `${place.name} - ${place.type} (${place.municipality}, ${place.county})`;
      placeListElement.appendChild(placeElement)
    }
  },
  getPlaceIdFromElement: function (event) {
    const placeId = event.target.attributes.placeid.value;
    return Number.parseInt(placeId);
  },
  createForecast: function (forecastData) {
    const placeListElement = document.getElementById('place-list');
    placeListElement.innerHTML = '';

    const forecastsElement = document.getElementById('forecasts');
    const forecast = document.createElement('div');
    forecast.classList.add('forecast');
    forecast.setAttribute('placeid', forecastData.id);
    const location = document.createElement('div');
    location.classList.add('location');
    location.innerText = forecastData.locationName;
    forecast.appendChild(location);
    const temp = document.createElement('div');
    temp.classList.add('temp');
    temp.innerHTML = `${forecastData.temp} &deg;C`;
    forecast.appendChild(temp);
    forecastsElement.appendChild(forecast);
  }
};