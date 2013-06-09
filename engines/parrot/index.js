"use strict";

var fs = require('fs');
var parrot = require('parrot');

exports.name = "Parrot";
exports.version = parrot.version;

var nextTick = setImmediate || process.nextTick;
function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.parrot', 'utf8', function (err, text) {
        if (err) return done(err);
        
        done(null, text);
      });
    },
    step: function (template, data, done) {
      done(null, parrot.render(template, { sandbox: data, cache: -1 }));
    }
  };
}

exports.unescaped = makeExport('unescaped');