var ECT = require('ect');

exports.name = "ECT";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/ect/package.json")).version;

function makeExport(name) {
  var filename = name + ".ect";
  return {
    prepare: function (done) {
      var renderer = new ECT({ root: __dirname, cache: true });
      try {
        renderer.render(filename, {});
      } catch (e) {}
      done(null, renderer);
    },
    step: function (renderer, data, done) {
      renderer.render(filename, data, done);
    }
  }
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
exports.partial = makeExport('partial');
exports.singleInheritance = makeExport('single-inheritance');
exports.multiInheritance = makeExport('multi-inheritance');
