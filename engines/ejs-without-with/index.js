var ejs = require('ejs');
var fs = require('fs');

exports.name = "ejs (without `with`)";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/ejs/package.json")).version;

function makeExport(name) {
  return {
    prepare: function (done) {
      var filename = __dirname + '/' + name + '.ejs';
      fs.readFile(filename, 'utf8', function (err, text) {
        if (err) return done(err);
        done(null, ejs.compile(text, { filename: filename, _with: false }));
      });
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  }
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
exports.partial = makeExport('partial');
