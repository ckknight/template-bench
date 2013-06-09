var fs = require('fs');
var _ = require('underscore');

exports.name = "Underscore";
exports.version = _.VERSION;

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.html', 'utf8', function (err, text) {
        if (err) return done(err);
        done(null, _.template(text));
      });
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
