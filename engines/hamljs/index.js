var fs = require('fs');
var hamljs = require('hamljs');

exports.name = "haml.js";
exports.version = hamljs.version;

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.haml', 'utf8', function (err, text) {
        done(null, hamljs.compile(text));
      });
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
