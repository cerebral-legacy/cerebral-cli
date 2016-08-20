const path = require('path')
const fs = require('fs-extra')
const CWD = process.cwd()
var merge = require('./utils').merge

function testing(package, currentView, appName, cliDirectory) {
  console.log('jamin')
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

  // fs.mkdirsSync(`${CWD}/${appName}/src/tests`)
  // fs.copySync(`${cliDirectory}/scaffold/${currentView.toLowerCase()}/testing/karma.config.js`, `${CWD}/${appName}/karma.config.js`)
  //
  // pkg.scripts = scripts
  //
  // const data = fs.writeFileSync(
  //   `${CWD}/${appName}/package.json`, JSON.stringify(pkg, null, 2)
  // )
}
