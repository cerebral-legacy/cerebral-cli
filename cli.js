#!/usr/bin/env node
'use strict'

const yargs = require('yargs')
const pkg = require('./package.json')
const tasks = require('./tasks.js')

const COMMANDS = {
  new: 'Scaffold and initialize a new Cerebral application.'
}

const USAGE = 'Usage: cerebral-cli <command> {options}'
const AVAILABLE_COMMANDS = `Available commands: ${Object.keys(COMMANDS).join(', ')}`

const argv = yargs
  .usage(USAGE)
  .demand(1)
  .check(function (argv) {
    if (Object.keys(COMMANDS).indexOf(command) === -1) {
      throw Error(
        `Invalid command: ${command}
        ${AVAILABLE_COMMANDS}`
      )
    }
    return true
  })

Object.keys(COMMANDS).forEach(command => {
  argv.command(command, COMMANDS[command], function(argv) {
    if (!argv.argv._[1]) throw new Error('You must provide an application name.')
  })
})

argv
  .example('cerebral-cli new my-app', 'Create new-app dir with project files.')

argv
  .version(pkg.version)
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .argv

const ARGV = argv.argv
const command = ARGV._[0]
const options = {
  appName: ARGV._[1]
}

tasks[command](options)
