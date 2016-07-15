import controller from './controller'
import inquirer from 'inquirer' 

export const Separator = inquirer.Separator

export function connect (paths, promptFactory) {
  return function () {
    return promptFactory(Object.keys(paths || {}).reduce(function (props, key) {
      props[key] = paths[key].getDepsMap ? paths[key].get(controller.get()) : controller.get(paths[key])
      return props
    }, { signals: controller.getSignals() }))
  }
}

export function render (component) {
  let { questions, then } = component()
  inquirer.prompt(questions)
    .then(then)
    .then(() => new Promise((resolve) => controller.once('signalEnd', resolve)))
    .then(() => render(component))
}
