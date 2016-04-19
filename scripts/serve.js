const CWD = process.cwd();
var spawn = require('child_process').spawnSync;
// const pkg   = require('./package.json');

module.exports = function serve(options) {
  const ALLOWED_OPTIONS = ['index', 'config', 'devtool', 'port']
  var defaults = {
    '--index': 'index.html',
    '--config': 'webpack.config.js',
    '--devtool': 'eval-source-map',
    '--port': '3000'
  }
  var userOpts = ALLOWED_OPTIONS
    .reduce((opts, opt) => {
      if (options[opt]) opts[`--${opt}`] = options[opt];
      return opts;
    },{});
  var mergedOpts = Object.assign({}, defaults, userOpts);
  var cliOpts    = Object.keys(mergedOpts).reduce((opts,opt) => {
    return opts.concat([`${opt}`, mergedOpts[opt]]);
  },[]);

  spawn(
    'kotatsu',
    ['serve', 'src/main.js'].concat(cliOpts),
    {stdio: 'inherit'}
  );
}
