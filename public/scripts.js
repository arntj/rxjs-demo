const btn = document.getElementById('search');
const input = document.getElementById('place');

const clickEventStream =
  Rx.Observable.fromEvent(btn, 'click');

const keyPressEventStream =
  Rx.Observable.fromEvent(document, 'keypress')
                .filter(ev => ev.key === 'Enter');

const clickSubscription = clickEventStream.subscribe(() => console.log('you clicked the button!'));

const keyPressSubscription = keyPressEventStream.subscribe(() => console.log('you clicked enter!'));