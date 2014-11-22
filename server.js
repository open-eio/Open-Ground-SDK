var fs = require('fs')
var l = require('./lib/log.js')
l.context = __filename
var config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'))
var settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf8'))

var app = require('express')()
var server = require('http').Server(app)
app.use(require('express').bodyParser())

app.get('/settings', function(req, res) {
  settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf8'))
  res.send(settings)
})

app.post('/settings', function(req, res) {

  var newSettings = req.body
  var oldSettings = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf8'))
  var operations = {}
  var messages = []
  var hasNewWifiSettings = function() {
    return newSettings.wifiSSID !== '' 
        && (newSettings.wifiSSID !== oldSettings.wifiSSID 
        || newSettings.wifiPassword !== oldSettings.wifiPassword
  }
  var hasNewHostName = function() {
    return newSettings.hostName !== '' 
      && newSettings.hostName !== oldSettings.hostName
  }

  fs.writeFileSync(__dirname + "/../settings.json", JSON.stringify(newSettings))

  if (hasNewWifiSettings()) {
    operations.push('ReconfigureNetwork')
    operations.push('Reboot')
  }
  if (hasNewHostName()) {
    operations.push('ReconfigureHostname')
  }
  
  var runOperations = function(operations, runOperationsDone) {
    var errors = []
    var messages = []
    var runOperation = function() {
      if (operations.length == 0) return runOperationsDone(errors, messages)
      var operation = operations.shift()
      var operation = require('./operations/' + operationName)
      operation(newSettings, function(err, msg) {
        if (err) l.g(err)
        if (err) errors.push(err)
        if (msg) messages.push(msg)
      }) 
    }
    runOperation()
  }

  runOperations(operations, function(errors, messages) {
    res.send({
      errors: errors,
      messages: messages
    })
  })

})

server.listen(9696)
l.g('server now listening at port 9696')
