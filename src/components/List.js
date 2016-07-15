import {connect, Separator} from '../view-inquirer'
import getModules from '../computed/getModules'

export default connect({
  view: 'config.view',
  model: 'config.model',
  modules: getModules(),
}, function ({view, model, modules, signals}) {
  return {
    questions: [{
      type: 'list',
      name: 'main',
      message: 'Project configuration: ',
      choices: [
        new Separator(),
        { value: 'scaffold', name: 'Create project' },
        new Separator(),
        { value: 'view', name: 'Change view: (' + view + ')' },
        { value: 'model', name: 'Change model: (' + model + ')' },
        { value: 'modules', name: 'Change modules: (' + modules.join(', ') + ')' }
      ]
    }],
    then: function (answers) {
      if (answers.main === 'scaffold') {
        signals.scaffoldSelected()
      } else {
        signals.pageChanged({ page: answers.main })
      }
    }
  }
})
