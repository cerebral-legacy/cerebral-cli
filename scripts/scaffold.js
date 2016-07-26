const path = require('path')
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
        'Create project',
        new inquirer.Separator(),
        'Change view: (' + currentView + ')',
        'Change model: (' + currentModel + ')',
        'Change modules: (' + currentModules + ')'
      ]
    }])
    .then(function (answers) {
      if (answers.main.indexOf('Create project') === 0 || answers.main.indexOf('Default') === 0) {
        scaffold()
      }
      if (answers.main.indexOf('Change view') === 0) { view() }
      if (answers.main.indexOf('Change model') === 0) { model() }
      if (answers.main.indexOf('Change modules') === 0) { modules() }
    })
  }

  function view() {
    inquirer.prompt([  {
      type: 'list',
      name: 'view',
      message: 'View package:',
      choices: ['React', 'Snabbdom', 'Inferno', 'None']
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
      'Inferno': 'cerebral-view-inferno',
      // Modules
      modules: {
        'Devtools': 'cerebral-module-devtools',
        'Router': 'cerebral-module-router',
        'Http': 'cerebral-module-http',
        'Useragent': 'cerebral-module-useragent'
      }
    }

    var pkg = require(`../scaffold/${currentView.toLowerCase()}/package.json`)

    fs.mkdirsSync(`${CWD}/${appName}`)

    var cliDirectory = path.resolve(__dirname, '../')

    console.log(`\n* Scaffolding new Cerebral application with: ${currentView}, ${currentModel}, ${currentModules.join(', ')}:\n`)

    // copy scaffold files
    fs.copySync(`${cliDirectory}/scaffold/${currentView.toLowerCase()}/main.js`, `${CWD}/${appName}/src/main.js`)
    fs.copySync(`${cliDirectory}/scaffold/${currentView.toLowerCase()}/components`, `${CWD}/${appName}/src/components`)

    fs.copySync(`${cliDirectory}/scaffold/${currentView.toLowerCase()}/webpack.config.js`, `${CWD}/${appName}/webpack.config.js`)
    fs.copySync(`${cliDirectory}/scaffold/${currentView.toLowerCase()}/package.json`, `${CWD}/${appName}/package.json`)

    fs.copySync(`${cliDirectory}/scaffold/shared/index.html`, `${CWD}/${appName}/index.html`)
    fs.copySync(`${cliDirectory}/scaffold/shared`, `${CWD}/${appName}/src`)
    fs.removeSync(`${CWD}/${appName}/src/index.html`)

    writeModules()

    var modelFile = fs.readFileSync(`${cliDirectory}/scaffold/shared/model.js`, 'utf8')

    // write selected model import statement
    model = modelFile.replace('{{MODEL}}', `\'cerebral/models/${currentModel.toLowerCase()}\'`)
    fs.writeFileSync(`${CWD}/${appName}/src/model.js`, model)

    process.chdir(appName)

    stdout = exec('git init', {stdio: [0]})
    console.log(`* ${stdout.toString()}`)

    pkg.name = dasherize(appName)

    var modulePkgs = currentModules.map(function(moduleName) {
      return httpGet('registry.npmjs.org', `/${PACKAGES.modules[moduleName]}`)
    })

    Promise.all([
      // httpGet('registry.npmjs.org', `/${PACKAGES[currentView]}`),
      httpGet('registry.npmjs.org', `/${PACKAGES[currentModel]}`)
    ].concat(modulePkgs))
    .then(writeLatestPackages)
    .then(function () {
      var npm = spawn('npm', ['install'], {stdio: 'inherit'})
      console.log('* installing npm packages...\n')

      npm.on('close', function (code) {
        console.log('* All npm packages successfully installed!')
        console.log(`\n---------------------------------------------------------------------------`)
        console.log(`\n* SUCCESS: New application '${appName}' created at '${CWD}'`)
        console.log('\n1. Go to project directory')
        console.log('\n2. Run \'npm start\'')
        console.log('\n3. Go to \'localhost:3000\' in your browser')
      })
    })

    function writeLatestPackages (pkgs) {
      pkgs.forEach(function (npmPackage) {
        pkg.dependencies[npmPackage.name] = npmPackage['dist-tags'].latest
      })
      const data = fs.writeFileSync(
        `${CWD}/${appName}/package.json`, JSON.stringify(pkg, null, 2)
      )
      return Promise.resolve(data)
    }

    function writeModules() {
      var controllerFile = fs.readFileSync(`${cliDirectory}/scaffold/shared/controller.js`, 'utf8')

      var generatedText = currentModules.reduce(function(text, moduleName) {
        var importName =
`import ${moduleName} from '${PACKAGES.modules[moduleName]}'
{{MODULE_IMPORTS}}`

        return text.replace('{{MODULE_IMPORTS}}', importName)
      }, controllerFile)

      var controllerFileText = generatedText.replace('{{MODULE_IMPORTS}}', '')

      var generated = currentModules.reduce(function(text, moduleName) {
        var importName =
  `${moduleName.toLowerCase()}: ${moduleName}(),
  {{MODULES}}`

        return text.replace('{{MODULES}}', importName)
      }, controllerFileText)

      var controllerText = generated.replace('{{MODULES}}', '')
      fs.writeFileSync(`${CWD}/${appName}/src/controller.js`, controllerText)
    }
  }
}
