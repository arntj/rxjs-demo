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