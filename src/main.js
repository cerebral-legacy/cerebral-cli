import controller from './controller.js'
import {set, copy} from 'cerebral/operators'
import {render} from './view-inquirer' 
import Main from './components/Main'

controller.addSignals({
  pageChanged: [ copy('input:page', 'state:page') ],
  scaffoldSelected: [
    () => console.log('scaffold'),
    () => { /* services.scaffold(options) */ },
    () => process.exit()
  ],
  aborted: [ () => { process.exit() } ]
})


render(Main)
