var swig = require('swig');

exports.name = "swig";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/swig/package.json")).version;

swig.init({
	root: __dirname,
  filters: {
    nicePrice: function (x) {
      return x.toFixed(2);
    }
  }
});

function makeExport(name) {
  return {
    prepare: function (done) {
      done(null, swig.compileFile('./' + name + '.swig'));
    },
    step: function (compiled, data, done) {
      done(null, compiled.render(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
exports.partial = makeExport('partial');
exports.singleInheritance = makeExport('single-inheritance');
exports.multiInheritance = makeExport('multi-inheritance');
