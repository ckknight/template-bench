var dot = require('dot');
var fs = require('fs');

exports.name = "doT";
exports.version = dot.version;

function makeExport(name, externals) {
  if (!externals) {
    externals = {};
  }
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.dot', 'utf8', function (err, text) {
        if (err) return done(err);
        var externalKeys = Object.keys(externals);
        var def = {};
        function next(i) {
          if (i >= externalKeys.length) {
            done(null, dot.template(text, null, def));
          } else {
            fs.readFile(__dirname + '/' + externals[externalKeys[i]] + '.dot', 'utf8', function (err, text) {
              if (err) return done(err);
              def[externalKeys[i]] = text;
              next(i + 1);
            })
          }
        }
        next(0);
      });
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
exports.partial = makeExport('partial', { _item: '_item' });
