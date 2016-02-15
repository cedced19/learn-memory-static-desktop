var packager = require('electron-packager');
var pkg = require('./package.json');
require('child_process').exec('npm install --production', {cwd: './app'});
packager({
  arch: 'x64',
  platform: 'win32',
  icon: 'favicon.ico',
  name: 'Learn-Memory-Static',
  overwrite: true,
  dir: './app',
  out: './build',
  version: pkg.electronVersion
}, function done (err, appPath) {
  if (err) throw err;
  console.log(`The app was compiled in ${appPath}.` )
});
