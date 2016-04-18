const fs  = require('fs-extra');
const CWD = process.cwd();
var exec  = require('child_process').execSync;
var spawn = require('child_process').spawn;

module.exports = function scaffold(options) {
  const appName = options.appName;

  fs.mkdirs(`${CWD}/${appName}`, function (err) {
    if (err) return console.error(err)
  });

  var stdout = exec("npm root -g", {stdio:[0]});
  const cliDirectory = `${stdout.toString()}/cerebral-cli`;

  fs.copySync(`${cliDirectory}/scaffold`, `${CWD}/${appName}`);
  console.log(`\n* Scaffolding new Cerebral application:\n`);

  stdout = exec(`find ${appName} -type d -print`, {stdio: [0]});
  console.log(`${stdout.toString()}`);

  process.chdir(appName);

  stdout = exec('git init', {stdio: [0]});
  console.log(`* ${stdout.toString()}`);

  npm = spawn('npm', ['install'], {stdio: 'inherit'});
  console.log('* installing npm packages...\n');

  npm.on('close', function(code) {
    console.log('* All npm packages successfully installed!');
    console.log(`\n---------------------------------------------------------------------------`);
    console.log(`\n* SUCCESS: New application '${appName}' created at '${CWD}'.\n`);
  });
};
