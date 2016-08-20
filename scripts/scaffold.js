const path = require('path')
const fs = require('fs-extra')
const CWD = process.cwd()
var exec = require('child_process').execSync
var spawn = require('cross-spawn')
var inquirer = require('inquirer')
var httpGet = require('./utils').httpGet
var dasherize = require('./utils').dasherize
var merge = require('./utils').merge

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

    if (options.testing) {
      var scripts = {
        "start": "webpack-dev-server",
        "build": "webpack --config webpack.config.js --progress --verbose",
        "check-outdated": "node_modules/.bin/npm-check -s --no-emoji",
        "update-packages": "node_modules/.bin/npm-check -u",
        "test": "NODE_ENV=test node_modules/.bin/karma start karma.config.js --coverage",
        "test:watch": "NODE_ENV=test node_modules/.bin/karma start karma.config.js --watch",
        "test:debug": "NODE_ENV=test node_modules/.bin/karma start karma.config.js --debug",
        "test:chrome": "NODE_ENV=test node_modules/.bin/karma start karma.config.js --chrome --watch"
      }
      var devDependencies = {
        "babel-plugin-__coverage__": "^11.0.x",
        "babel-polyfill": "^6.13.x",
        "cerebral-testable": "^1.1.x",
        "chai": "^3.5.x",
        "karma": "^1.1.x",
        "karma-chai": "^0.1.x",
        "karma-chrome-launcher": "^1.0.x",
        "karma-coverage": "^1.1.x",
        "karma-mocha": "^1.1.x",
        "karma-phantomjs-launcher": "^1.0.x",
        "karma-sourcemap-loader": "^0.3.x",
        "karma-spec-reporter": "^0.0.x",
        "karma-threshold-reporter": "^0.1.x",
        "karma-webpack": "^1.7.x",
        "mocha": "^3.0.x",
        "npm-check": "^5.2.x",
        "phantomjs-prebuilt": "^2.1.x",
        "sinon": "^1.17.x",
        "yargs": "^4.8.x"
      }
      var reactDevDependencies = {
        "chai-enzyme": "^0.5.x",
        "enzyme": "^2.4.x",
        "react-addons-test-utils": "^15.3.x"
      }

      fs.mkdirsSync(`${CWD}/${appName}/src/test`)
      fs.mkdirsSync(`${CWD}/${appName}/src/test/components`)
      fs.mkdirsSync(`${CWD}/${appName}/src/test/computed`)
      fs.mkdirsSync(`${CWD}/${appName}/src/test/chains`)

      var karmaConfig = (currentView === 'React')
        ? `${cliDirectory}/scaffold/testing/karma.config.react.js`
        : `${cliDirectory}/scaffold/testing/karma.config.js`

      fs.copySync(karmaConfig, `${CWD}/${appName}/karma.config.js`)

      pkg.scripts = scripts
      merge(pkg.devDependencies, devDependencies)

      if (currentView === 'React') merge(pkg.devDependencies, reactDevDependencies)

      fs.writeFileSync(`${CWD}/${appName}/package.json`, JSON.stringify(pkg, null, 2))

      fs.copySync(`${cliDirectory}/scaffold/testing/newItemTitleChangedTest.js`,
        `${CWD}/${appName}/test/chains/newItemTitleChangedTest.js`)
    }

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

    if (currentView !== 'None') {
      modulePkgs.concat(httpGet('registry.npmjs.org', `/${PACKAGES[currentView]}`))
    }

    modulePkgs.concat(httpGet('registry.npmjs.org', `/${PACKAGES[currentModel]}`))

    Promise.all(modulePkgs)
      .then(writeLatestPackages)
      .then(function () {
        var npm = spawn('npm', ['install'], {stdio: 'inherit'})
        console.log('* installing npm packages...\n')

        npm.on('error', function (e) {
          console.log(e)
        })

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
