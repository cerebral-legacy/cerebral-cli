import Inferno from 'inferno'
import {render} from 'inferno-dom'
import {Container} from 'cerebral-view-inferno'

import controller from './controller'
import App from './components/App'

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
