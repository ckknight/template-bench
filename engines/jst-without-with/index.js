var jst = require('jst');
var fs = require('fs');

exports.name = "Node-jst (without `with`)";
exports.version = jst.version;

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.jst', 'utf8', function (err, text) {
        if (err) return done(err);
        done(null, jst.compile(text));
      });
    },
    step: function (template, data, done) {
      done(null, template(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
