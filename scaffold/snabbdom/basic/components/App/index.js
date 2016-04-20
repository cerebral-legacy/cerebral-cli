import {Component, h} from 'cerebral-view-snabbdom';

export default Component({
  newItemValue: ['app', 'newItemValue'],
  items: ['app', 'items']
}, ({state, signals}) => {

  function onKeyup(e) {
    signals.app.newItemValueChanged({
      value: e.target.value
    });
  }
  function onSubmit(e) {
    e.preventDefault();
    signals.app.newItemSubmitted();
  }

  return h('div', [
    h('h1', 'Demo APP'),
    h('form', {on: {submit: onSubmit}}, [
      h('input', {props: {
        type: 'text', value: state.newItemValue},
        on: {keyup: onKeyup}
      })
    ]),
    h('ul', state.items.map((item, index) => h('li', item)))
  ]);
});
