"use strict";

var fs = require('fs');
var Templ8 = require('Templ8');

exports.name = "Templ8";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/Templ8/package.json")).version;

function optionsFor(name) {
  var options = { compiled: true };
  if (name === "escaped") {
    options.filters = require('../../node_modules/Templ8/Templ8.Filter.html.js');
  }
  return options;
}

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.templ8', 'utf8', function (err, text) {
        if (err) return done(err);
        
        done(null, new Templ8(text, optionsFor(name)));
      });
    },
    step: function (template, data, done) {
      done(null, template.parse(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');