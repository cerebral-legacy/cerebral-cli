const CWD = process.cwd();
var exec = require('child_process').exec;
// const pkg   = require('./package.json');

module.exports = function serve(appName, args) {
  exec(`kotatsu serve app/main.js --port 3007`, function (error, stdout, stderr) {
    if (error) return console.error(error);
    console.log(stdout);
    console.log(stderr);
  });
}
