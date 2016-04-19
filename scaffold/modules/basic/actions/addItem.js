function addItem({state}) {
  state.push('app.items', state.get('app.newItemValue'));
}

export default addItem;
