var fs = require('fs');
var haml = require('haml');

exports.name = "haml-js";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/haml/package.json")).version;;

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.haml', 'utf8', function (err, text) {
        done(null, haml(text));
      });
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
