import newItemSubmitted from './signals/newItemSubmitted';
import newItemValueChanged from './signals/newItemValueChanged';

export default (module) => {
  module.addState({
    newItemValue: '',
    items: []
  });

  module.addSignals({
    newItemSubmitted,
    newItemValueChanged: {
      chain: newItemValueChanged,
      immediate: true
    }
  })
}
