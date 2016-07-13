import controller from './controller'
import App from './components/App'

controller.on('flush', (changes) => {
  // Traverse changes and use `controller.get('some.path')`
  // to update state
})
