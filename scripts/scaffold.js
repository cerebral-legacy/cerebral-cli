const fs  = require('fs-extra');
const CWD = process.cwd();
var exec = require('child_process').exec;

module.exports = function scaffold(appName) {
  fs.mkdirs(`${CWD}/${appName}`, function (err) {
    if (err) return console.error(err)
  });

  fs.copy(`${CWD}/scaffold`, `${CWD}/${appName}`, function (err) {
    if (err) return console.error(err)
    console.log(`New Cerebral application: ${appName} created!`);

    process.chdir(appName);

    exec("git init", function (error, stdout, stderr) {
      if (error) return console.error(error);
      console.log(stdout);
      console.log(stderr);
    });
    exec("npm install", function (error, stdout, stderr) {
      if (error) return console.error(error);
      console.log(stdout);
      console.log(stderr);
    });
  });
}
