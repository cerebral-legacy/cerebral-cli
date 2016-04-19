import addItem from '../actions/addItem';
import set from 'cerebral-addons/set';

export default [
  addItem,
  set('state:/app.newItemValue', '')
];
