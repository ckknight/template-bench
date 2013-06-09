var hogan = require('hogan.js');
var fs = require('fs');

exports.name = "hogan.js";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/hogan.js/package.json")).version;

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.hogan', 'utf8', function (err, text) {
        if (err) return done(err);
        done(null, hogan.compile(text));
      });
    },
    step: function (compiled, data, done) {
      done(null, compiled.render(data));
    }
  };
}

// Hogan is currently broken because I don't know how to turn price into a toFixed string. (June 9, 2013)
//exports.escaped = makeExport('escaped');
//exports.unescaped = makeExport('unescaped');
