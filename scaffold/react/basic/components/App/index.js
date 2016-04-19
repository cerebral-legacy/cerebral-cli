import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

@Cerebral({
  newItemValue: 'app.newItemValue',
  items: 'app.items'
})
class App extends React.Component {
  onChange(e) {
    this.props.signals.app.newItemValueChanged({
      value: e.target.value
    });
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.signals.app.newItemSubmitted();
  }
  render() {
    const {newItemValue, items} = this.props;

    return (
      <div>
        <h1>Demo APP</h1>
        <form onSubmit={e => this.onSubmit(e)}>
          <input type="text" value={newItemValue} onChange={e => this.onChange(e)}/>
        </form>
        <ul>
          {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
    );
  }
}

export default App;
