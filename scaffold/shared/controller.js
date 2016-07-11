import Controller from 'cerebral'
import model from './model'
import updateItemTitle from './chains/updateItemTitle'
import addNewItem from './chains/addNewItem'
{{MODULE_IMPORTS}}
const controller = Controller(model)

controller.addSignals({
  newItemTitleChanged: {
    chain: updateItemTitle,
    immediate: true
  },
  newItemTitleSubmitted: addNewItem
})

controller.addModules({
  {{MODULES}}
})

export default controller
