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
module.exports = function(wirelessSSID, password, wirelessSecurityType, callback) {

  switch (wirelessSecurityType) {

    case 'none': 
      callback('RECONFIGURING SECURITY:NONE')
      var fileName = __dirname + '/interfaces.none.template'
      fs.readFile(fileName, 'utf8', function (err,data) {
        if (err) return callback(err)
        var result = data.replace("WIRELESSSSID", wirelessSSID)
        var fileName = '/etc/network/interfaces'
        fs.writeFile(fileName, result, 'utf8', function (err) {
          if (err) return callback(err)
          return callback() 
        })
      })
      break

    case 'WPA':
      callback('RECONFIGURING WPA')
      var fileName = __dirname + '/interfaces.wpa.template'
      fs.readFile(fileName, 'utf8', function (err,data) {
        if (err) return callback(err)
        var fileName = '/etc/network/interfaces'
        fs.writeFile(fileName, data, 'utf8', function (err) {
          if (err) return callback(err)
          fs.readFile(__dirname + '/wpa_supplicant.conf.template', function(err, data) {
            if (err) return callback(err)
            $wpa_supplicant_conf = data
            var cmd = 'wpa_passphrase "' + wirelessSSID + '" "' + password + '"'
            exec(cmd, function(err, stdout, stderr) {
              if (err) return callback(err)
              $wpa_supplicant_conf = $wpa_supplicant_conf + stdout
              fs.writeFile('/etc/wpa_supplicant/wpa_supplicant.conf', $wpa_supplicant_conf, function(err) {
                if (err) return callback(err)
                return callback()
              })
            })
          })
        })
      })
      break

  }
} 
