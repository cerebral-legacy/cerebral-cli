import {connect} from '../view-inquirer'
import List from './List'

export default connect({
  page: 'page'
}, ({page, signals}) => {
  if (page === 'start') return List()
  return {
    questions: [{
      type: 'confirm',
      name: 'wtf',
      message: `Unknown page: ${page}. Exit?`
    }],
    then: function (answers) {
      if (answers.wtf) {
        signals.aborted()
      } else {
        signals.pageChanged({ page: 'start' })
      }
    }
  }
})
