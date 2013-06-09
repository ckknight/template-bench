var fs = require('fs');
var jade = require('jade');

exports.name = "Jade (without `with`)";
exports.version = jade.version;

function makeExport(name) {
  return {
    prepare: function (done) {
      var filename = __dirname + '/' + name + '.jade';
      fs.readFile(filename, 'utf8', function (err, text) {
        done(null, jade.compile(text, { compileDebug: false, filename: filename, self: true }));
      });
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
exports.partial = makeExport('partial');
exports.singleInheritance = makeExport('single-inheritance');
exports.multiInheritance = makeExport('multi-inheritance');
