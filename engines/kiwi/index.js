var kiwi = require('kiwi');

exports.name = "Kiwi";
exports.version = kiwi.version;

function makeExport(name) {
  return {
    prepare: function (done) {
      var template = new kiwi.Template();
      template.loadFile(__dirname + '/' + name + '.kiwi', function (err) {
        if (err) return done(err);
        done(null, template);
      });
    },
    step: function (template, data, done) {
      template.render(data, done);
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
// Kiwi's include statement is broken in an if (as of June 9, 2013)
//exports.partial = makeExport('partial');
exports.singleInheritance = makeExport('single-inheritance');
exports.multiInheritance = makeExport('multi-inheritance');
