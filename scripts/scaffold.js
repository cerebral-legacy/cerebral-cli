const fs = require('fs-extra')
const CWD = process.cwd()
var exec = require('child_process').execSync
var spawn = require('child_process').spawn
var inquirer = require('inquirer')
var httpGet = require('./utils').httpGet
var dasherize = require('./utils').dasherize

module.exports = function scaffold (options) {
  var currentView = 'React';
  var currentModel = 'Immutable';
  var currentModules = ['Devtools']

  function main() {
    inquirer.prompt([{
      type: 'list',
      name: 'main',
      message: 'Project configuration: ',
      choices: [
        new inquirer.Separator(),
        'Default',
        new inquirer.Separator(),
        'Change view: (' + currentView + ')',
        'Change model: (' + currentModel + ')',
        'Change modules: (' + currentModules + ')',
        'Done'
      ]
    }])
    .then(function (answers) {
      if (answers.main.indexOf('Change view') === 0) {
        view()
      }
      if (answers.main.indexOf('Change model') === 0) {
        model()
      }
      if (answers.main.indexOf('Change modules') === 0) {
        modules()
      }
      if (answers.main.indexOf('Done') === 0 || answers.main.indexOf('Default') === 0) {
        scaffold()
      }
    })
  }

  function view() {
    inquirer.prompt([  {
      type: 'list',
      name: 'view',
      message: 'View package:',
      choices: ['React', 'Snabbdom']
    }])
    .then(function (answers) {
      currentView = answers.view
      main()
    });
  }

  function model() {
    inquirer.prompt([  {
      type: 'list',
      name: 'model',
      message: 'Model package:',
      choices: ['Immutable', 'Mutable']
    }])
    .then(function (answers) {
      currentModel = answers.model
      main()
    });
  }

  function modules() {
    inquirer.prompt([  {
      type: 'checkbox',
      name: 'modules',
      message: 'Cerebral modules:',
      choices: [{
        name: 'Devtools',
        checked: currentModules.indexOf('Devtools') >= 0
      }, {
        name: 'Router',
        checked: currentModules.indexOf('Router') >= 0
      }, {
        name: 'Http',
        checked: currentModules.indexOf('Http') >= 0
      }, {
        name: 'Useragent',
        checked: currentModules.indexOf('Useragent') >= 0
      }]
    }])
    .then(function (answers) {
      currentModules = answers.modules
      main()
    });
  }

  main();

  function scaffold() {
    const appName = options.appName

    const PACKAGES = {
      // Views
      'React': 'cerebral-view-react',
      'Snabbdom': 'cerebral-view-snabbdom',
      // Models
      'Immutable': 'cerebral-model-immutable',
      'Mutable': 'cerebral-model',
      // Modules
      'Devtools': 'cerebral-module-devtools',
      'Router': 'cerebral-module-router',
      'Http': 'cerebral-module-http',
      'Useragent': 'cerebral-module-useragent'
    }

    var pkg = require(`../scaffold/${currentView.toLowerCase()}/package.json`)

    fs.mkdirs(`${CWD}/${appName}`, function (err) {
      if (err) return console.error(err)
    })

    var stdout = exec('npm root -g', {stdio: [0]})
    var cliDirectory = `${stdout.toString().split('\n')[0]}/cerebral-cli`

    console.log(`\n* Scaffolding new Cerebral application with: ${currentView}, ${currentModel}, ${currentModules.join(', ')}:\n`)

    // fs.copySync(`${cliDirectory}/scaffold/index.html`, `${CWD}/${appName}/index.html`)
    // fs.copySync(`${cliDirectory}/scaffold/${answers.view.toLowerCase()}/webpack.config.js`, `${CWD}/${appName}/webpack.config.js`)
    // fs.copySync(`${cliDirectory}/scaffold/modules/basic`, `${CWD}/${appName}/src/modules/App`)
    // fs.copySync(`${cliDirectory}/scaffold/${answers.view.toLowerCase()}/basic`, `${CWD}/${appName}/src`)
    //
    // var controller = fs.readFileSync(`${cliDirectory}/scaffold/controller.js`, 'utf8')
    // controller = controller.replace('{{MODEL}}', packages[answers.model])
    // controller = controller.replace('{{MODULES}}', '')
    //
    // fs.writeFileSync(`${CWD}/${appName}/src/controller.js`, controller)
    //
    // stdout = exec(`find ${appName} -type d -print`, {stdio: [0]})
    // console.log(`${stdout.toString()}`)
    //
    // process.chdir(appName)
    //
    // stdout = exec('git init', {stdio: [0]})
    // console.log(`* ${stdout.toString()}`)
    //
    // pkg.name = dasherize(appName)
    //
    // Promise.all([
    //   httpGet('registry.npmjs.org', `/${packages[answers.view]}`),
    //   httpGet('registry.npmjs.org', `/${packages[answers.model]}`)
    // ])
    // .then(writeLatestPackages)
    // .then(function () {
    //   // var npm = spawn('npm', ['install'], {stdio: 'inherit'})
    //   console.log('* installing npm packages...\n')
    //
    //   npm.on('close', function (code) {
    //     console.log('* All npm packages successfully installed!')
    //     console.log(`\n---------------------------------------------------------------------------`)
    //     console.log(`\n* SUCCESS: New application '${appName}' created at '${CWD}'.\n`)
    //   })
    // })
    //
    // function writeLatestPackages (pkgs) {
    //   pkgs.forEach(function (npmPackage) {
    //     pkg.dependencies[npmPackage.name] = npmPackage['dist-tags'].latest
    //   })
    //   const data = fs.writeFileSync(
    //     `${CWD}/${appName}/package.json`, JSON.stringify(pkg, null, 2)
    //   )
    //   return Promise.resolve(data)
    // }
  }

  // inquirer.prompt([{
  //   type: 'list',
  //   name: 'view',
  //   message: 'What view layer do you want to use?',
  //   choices: ['React', 'Snabbdom']
  // }, {
  //   type: 'list',
  //   name: 'model',
  //   message: 'What model layer you want to use?',
  //   choices: ['Cerebral Model Immutable', 'Cerebral Model (mutable)']
  // }]).then(function (answers) {
  // })
}
