const fs  = require('fs-extra');
const CWD = process.cwd();
var exec  = require('child_process').execSync;

module.exports = function scaffold(appName) {
  fs.mkdirs(`${CWD}/${appName}`, function (err) {
    if (err) return console.error(err)
  });

  var stdout = exec("npm bin",{stdio:[0]});
  const cliDirectory = `${stdout.toString('utf8').split('/.bin')[0]}/cerebral-cli`;

  fs.copySync(`${cliDirectory}/scaffold`, `${CWD}/${appName}`);
  console.log(`New Cerebral application: ${appName} created!`);
  process.chdir(appName);

  stdout = exec('git init', {stdio: [0]});
  console.log(stdout.toString());
  stdout = exec('npm install', {stdio: [0]});
  console.log(stdout.toString());
};
