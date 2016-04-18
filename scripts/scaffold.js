const fs  = require('fs-extra');
const CWD = process.cwd();
var exec  = require('child_process').execSync;
var spawn = require('child_process').spawn;
var inquirer = require('inquirer');
var packageJson = require('../scaffold/package.json');

module.exports = function scaffold(options) {

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
  }]).then(function (answers) {
    console.log(answers);
    const appName = options.appName;

    fs.mkdirs(`${CWD}/${appName}`, function (err) {
      if (err) return console.error(err)
    });

    var stdout = exec("npm root -g", {stdio:[0]});
    var cliDirectory = `${stdout.toString().split('\n')[0]}/cerebral-cli`;

    fs.copySync(`${cliDirectory}/scaffold`, `${CWD}/${appName}`);
    console.log(`\n* Scaffolding new Cerebral application:\n`);

    stdout = exec(`find ${appName} -type d -print`, {stdio: [0]});
    console.log(`${stdout.toString()}`);

    process.chdir(appName);

    stdout = exec('git init', {stdio: [0]});
    console.log(`* ${stdout.toString()}`);

    packageJson.name = appName; // Dashify it

    // Do a request to http://registry.npmjs.org/cerebral
    // look up "latest" on the prop "dist-tags"
    if (answers.view === 'React') {
      packageJson.dependencies['cerebral-view-react'] = '^0.11.x';
    }

    if (answers.model === 'Baobab') {
      packageJson.dependencies['cerebral-model-baobab'] = '^0.4.x';
      packageJson.dependencies['baobab'] = '^2.3.x';
    }

    console.log(packageJson);
    fs.writeFileSync(`${CWD}/${appName}/package.json`, JSON.stringify(packageJson));
    console.log('Updated package.json file!');

    return;

    npm = spawn('npm', ['install'], {stdio: 'inherit'});
    console.log('* installing npm packages...\n');

    npm.on('close', function(code) {
      console.log('* All npm packages successfully installed!');
      console.log(`\n---------------------------------------------------------------------------`);
      console.log(`\n* SUCCESS: New application '${appName}' created at '${CWD}'.\n`);
    });
  });

  return;
};
