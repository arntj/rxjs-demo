// this code example is partly based on the following article by Alex Sears
// https://auth0.com/blog/understanding-reactive-programming-and-rxjs/

const btn = document.getElementById('search');
const input = document.getElementById('place');

const clickEventStream =
  Rx.Observable.fromEvent(btn, 'click');

const keyPressEventStream =
  Rx.Observable.fromEvent(document, 'keypress')
                .filter(ev => ev.key === 'Enter');

const searchStream =
  clickEventStream.merge(keyPressEventStream)
                  .map(() => input.value)
                  .filter(search => search && search.length > 2)
                  .debounceTime(100);

const placeList = document.getElementById('place-list');

searchStream.forEach(search => {
  fetch('/searchPlaces?q='+search)
    .then(res => res.json())
    .then(res => {
      webHelpers.addPlaces(res);
    });
});

const clickPlaceStream =
  Rx.Observable.fromEvent(placeList, 'click')
                .map(webHelpers.getPlaceIdFromElement);

const getWeather = id =>
  fetch(`/getWeather?id=${id}`)
    .then(res => res.json());

const weatherStreamFactory = id =>
  Rx.Observable
    .fromPromise(getWeather(id));

clickPlaceStream
  .flatMap(weatherStreamFactory)
  .forEach(forecast => {
    webHelpers.createForecast(forecast);
  });

const replayPlacesStream = new Rx.ReplaySubject();
clickPlaceStream.subscribe(replayPlacesStream);

const refreshTimer =
  Rx.Observable.interval(5000)
                .switchMap(() => replayPlacesStream)
                .flatMap(weatherStreamFactory)
                .forEach(forecast => {
                  console.log(`${forecast.locationName}: ${forecast.temp} °C`);
                  const temp =
                    document.querySelector(`.forecast[placeid="${forecast.id}"] .temp`);
                    
                  temp.innerHTML = `${forecast.temp} &deg;C`
                });