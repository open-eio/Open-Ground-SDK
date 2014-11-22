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
module.exports = function(callback) {
  var cmd = 'sudo wpa_action wlan0 stop; '
  cmd += 'sudo reboot; '
  l.g('rebooting')
  exec(cmd, function(error, stdout, stderr) {
    if (error) return callback(error)
    return callback() 
  })
} 
