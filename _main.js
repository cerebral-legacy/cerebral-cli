import Controller from 'cerebral';
${VIEW_IMPORTS}
${MODEL_IMPORTS}
import Router from 'cerebral-module-router';
import Devtools from 'cerebral-module-devtools';
import Example from './modules/Example';
import ColorChanger from './components/ColorChanger';

const controller = Controller(Model({}));

controller.addModules({
  example: Example(),

  devtools: Devtools(),
  router: Router({
    '/': 'example.redirectRoot',
    '/:color': 'example.colorChanged'
  }, {
    onlyHash: true
  })
});

${INITIAL_RENDER}
