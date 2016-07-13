import {Controller} from 'cerebral'
import Model from 'cerebral-model-immutable'

export default Controller(Model({
  page: 'start',
  config: {
    model: 'immutable',
    view: 'react',
    modules: {
      devtools: true,
      router: true
    }
  }
}))
