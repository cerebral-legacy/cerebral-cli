# cerebral-cli
Command line tool for cerebral app development.

## Example usage
- `cerebral new my-app`
  1. creates a basic project directory at /my-app
  2. initializes new git repository
  3. installs npm dependencies

- `cd /my-app`

- `npm start`
  - runs a webpack-dev-server at localhost:3000
  - reloads on file changes

- `npm run build`
  - outputs bundle to `/build/bundle.js`
