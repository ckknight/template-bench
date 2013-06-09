"use strict";

var fs = require('fs');
var coffeecup = require('coffeecup');

exports.name = "CoffeeCup";
exports.version = coffeecup.version;

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.coffeecup', 'utf8', function(err, text) {
        if (err) return done(err);
        done(null, coffeecup.compile(text));
      });
    },
    step: function (template, data, done) {
      var html = template(data);
      done(null, html);
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
