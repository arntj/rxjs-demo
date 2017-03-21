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

searchStream.subscribe(console.log);