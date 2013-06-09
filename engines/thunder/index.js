"use strict";

var thunder = require('thunder');
var fs = require('fs');

exports.name = "thunder";
exports.version = thunder.version;

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.thunder', 'utf8', function (err, text) {
        if (err) return done(err);
        
        done(null, thunder.compile(text));
      })
    },
    step: function (template, data, done) {
      done(null, template(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
// Partial support doesn't actually exist in thunder, despite being in its docs (as of June 9, 2013)
//exports.partial = makeExport('partial');