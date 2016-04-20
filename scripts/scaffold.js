const fs        = require('fs-extra');
const CWD       = process.cwd();
var exec        = require('child_process').execSync;
var spawn       = require('child_process').spawn;
var inquirer    = require('inquirer');
var httpGet     = require('./utils').httpGet;
var dasherize   = require('./utils').dasherize;

module.exports = function scaffold(options) {
  const appName = options.appName;

  inquirer.prompt([{
    type: 'list',
    name: 'view',
    message: 'What view layer do you want to use?',
    choices: ['React', 'Angular', 'Angular2', 'Snabbdom', 'Inferno']
  }, {
    type: 'list',
    name: 'model',
    message: 'What model layer you want to use?',
    choices: ['Baobab', 'ImmutableJS']
  }]).then(function(answers) {
    var pkg = require(`../scaffold/${answers.view.toLowerCase()}/package.json`);

    fs.mkdirs(`${CWD}/${appName}`, function (err) {
      if (err) return console.error(err)
    });

    var stdout = exec("npm root -g", {stdio:[0]});
    var cliDirectory = `${stdout.toString().split('\n')[0]}/cerebral-cli`;

    console.log(`\n* Scaffolding new Cerebral application:\n`);

    fs.copySync(`${cliDirectory}/scaffold/index.html`, `${CWD}/${appName}/index.html`);
    fs.copySync(`${cliDirectory}/scaffold/${answers.view.toLowerCase()}/webpack.config.js`, `${CWD}/${appName}/webpack.config.js`);
    fs.copySync(`${cliDirectory}/scaffold/modules/basic`, `${CWD}/${appName}/src/modules/App`);
    fs.copySync(`${cliDirectory}/scaffold/${answers.view.toLowerCase()}/basic`, `${CWD}/${appName}/src`);

    var packages = {
      // Views
      'React': 'cerebral-view-react',
      'Angular': 'cerebral-view-angular',
      'Angular2': 'cerebral-view-angular2',
      'Snabbdom': 'cerebral-view-snabbdom',
      'Inferno': 'cerebral-view-inferno',
      // Models
      'Baobab': 'cerebral-model-baobab',
      'ImmutableJS': 'cerebral-model-immutable-js'
    }

    var controller = fs.readFileSync(`${cliDirectory}/scaffold/controller.js`, 'utf8');
    controller = controller.replace('{{MODEL}}', packages[answers.model]);
    controller = controller.replace('{{MODULES}}', '');

    fs.writeFileSync(`${CWD}/${appName}/src/controller.js`, controller);

    stdout = exec(`find ${appName} -type d -print`, {stdio: [0]});
    console.log(`${stdout.toString()}`);

    process.chdir(appName);

    stdout = exec('git init', {stdio: [0]});
    console.log(`* ${stdout.toString()}`);

    pkg.name = dasherize(appName);

    Promise.all([
      httpGet('registry.npmjs.org', `/${packages[answers.view]}`),
      httpGet('registry.npmjs.org', `/${packages[answers.model]}`)
    ])
    .then(writeLatestPackages)
    .then(function () {
      npm = spawn('npm', ['install'], {stdio: 'inherit'});
      console.log('* installing npm packages...\n');

      npm.on('close', function(code) {
        console.log('* All npm packages successfully installed!');
        console.log(`\n---------------------------------------------------------------------------`);
        console.log(`\n* SUCCESS: New application '${appName}' created at '${CWD}'.\n`);
      });
    });

    function writeLatestPackages(pkgs) {
      pkgs.forEach(function(npmPackage) {
        pkg.dependencies[npmPackage.name] = npmPackage['dist-tags'].latest;
      });
      const data = fs.writeFileSync(
        `${CWD}/${appName}/package.json`,
        JSON.stringify(pkg,null,2)
      );
      return Promise.resolve(data);
    }
  });
};
