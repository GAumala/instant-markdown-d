const exec = require('child_process').exec,
      os = require('os');

module.exports = function (url) {
  const handler = function(error, stdout, stderr){}
  if (process.env.INSTANT_MARKDOWN_BROWSER) {
    exec(process.env.INSTANT_MARKDOWN_BROWSER + ' ' + url, handler);
  } else if (os.platform() === 'win32') {
    exec('start /b ' + url, handler);
  } else if (os.platform() === 'darwin') {
    exec('open -g ' + url, handler);
  } else { // assume unix/linux
    exec('xdg-open ' + url, handler);
  }
}
