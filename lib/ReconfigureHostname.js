#!/usr/bin/env node

/**
 * Module dependencies.
 */

var sys = require('sys')
var exec = require('child_process').exec;
var _ = require('underscore')
var program = require('commander');
var fs = require('fs')
function puts(error, stdout, stderr) { sys.puts(stdout) } 
var l = require('../../lib/log.js')
l.context = __dirname + __filename 


// Set settings.hostname in /etc/hosts and etc/hostname
module.exports = function(newHostname, oldHostname, callback) {

  l.g('reconfiguring hostname')
  var fileName = __dirname + '/hosts.template'
  fs.readFile(fileName, 'utf8', function (err,data) {
    if (err) return l.g(err)

    var result = data.replace('HOSTNAME', newHostname)
    var fileName = '/etc/hosts'
    fs.writeFile(fileName, result, 'utf8', function (err) {
      if (err) return l.g(err)

      var fileName = '/etc/hostname'
      fs.readFile(fileName, 'utf8', function (err,data) {
        if (err) return l.g(err)

        var result = newHostname
        fs.writeFile(fileName, result, 'utf8', function (err) {
          if (err) return l.g(err)

          var cmd = ''
          cmd += 'sudo /etc/init.d/hostname.sh; '
          exec(cmd, function(error, stdout, stderr) {
            if (error) return callback(error)
            return callback() 
          })

        })
      })
    })
  })

} 
