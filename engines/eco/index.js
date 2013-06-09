var eco = require('eco');
var fs = require('fs');

exports.name = "Eco";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/eco/package.json")).version;

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + "/" + name + ".eco", "utf8", function (err, text) {
        if (err) return done(err);
        done(null, eco.compile(text));
      });
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
