import {render} from 'cerebral-view-snabbdom'

import controller from './controller'
import App from './components/App'

render(() => App(), document.querySelector('#app'), controller)
