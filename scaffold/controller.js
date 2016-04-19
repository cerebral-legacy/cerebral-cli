import Controller from 'cerebral';
import Model from '{{MODEL}}';
import DevtoolsModule from 'cerebral-module-devtools';
import AppModule from './modules/App';

const controller = Controller(Model({}));

controller.addModules({
  app: AppModule,

  devtools: DevtoolsModule()
  {{MODULES}}
});

export default controller;
