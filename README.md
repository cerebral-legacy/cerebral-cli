# cerebral-cli
Command line tool for bootstrapping cerebral app development.

## Install
`npm install cerebral-cli -g` - makes the `cerebral` command available globally

## Example usage

### `cerebral new my-app`
  1. creates a basic project directory at `./my-app`
  2. initializes new git repository
  3. installs npm dependencies

  Default project settings are: React, Immutable Model, and the Devtools module. However, the CLI allows you to select other options.

### `cd /my-app`

### `npm start`
  - runs a webpack-dev-server at `localhost:3000`
  - reloads on file changes

### `npm run build`
  - outputs bundle to `/build/bundle.js`
