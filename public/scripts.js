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