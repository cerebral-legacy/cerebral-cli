#!/usr/bin/env node
'use strict'

const yargs = require('yargs');
const pkg   = require('./package.json');
const cli   = require('./index.js');

const COMMANDS = {
  new:      'Scaffold and initialize a new Cerebral application.',
  serve:    'Serve your application on localhost.',
  build:    'Bundle your assets for distribution',
  generate: 'Generate files'
};

const USAGE              = 'Usage: cerebral-cli <command> {options}',
      AVAILABLE_COMMANDS = `Available commands: ${Object.keys(COMMANDS).join(', ')}`;

const argv = yargs
  .usage(USAGE)
  .demand(1)
  .check(function(argv) {
    if (!~Object.keys(COMMANDS).indexOf(command)) {
      throw Error(
        `Invalid command: ${command}
        ${AVAILABLE_COMMANDS}`
      );
    }
    return true;
  });

Object.keys(COMMANDS).forEach(command => {
  argv.command(command, COMMANDS[command]);
});

argv
  .example('cerebral-cli new my-app', 'Create new-app dir with project files.')
  .example('cerebral-cli serve --port 3005', 'Serve app in current dir at port 3005.')
  .example('cerebral-cli build', 'Bundle assets to dist dir.')
  .example('cerebral-cli generate module foo', 'Scaffold files for in-app module: foo.')

argv
  .version(pkg.version)
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .argv;

const ARGV    = argv.argv;
const command = ARGV._[0];
const options = {
  appName: ARGV._[0],
  port: ARGV.port,
  index: ARGV.index,
  config: ARGV.config
};

cli[command](options);
