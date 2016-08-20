var http = require('http')

function httpGet (host, path) {
  return new Promise(function (resolve, reject) {
    http.request({host,path}, (res) => {
      var data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        resolve(JSON.parse(data))
      })
    }).end()
  })
}

function dasherize (string) {
  return string.replace(/[A-Z]/g, function (char, index) {
    return (index !== 0 ? '-' : '') + char.toLowerCase()
  })
}

function merge(target, object) {
  Object.keys(object).forEach(function(key) {
    target[key] = object[key];
  })
  return target;
}

module.exports = {
  httpGet,
  dasherize,
  merge
}
