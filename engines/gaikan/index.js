var gaikan = require('gaikan');

exports.name = "Gaikan";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/gaikan/package.json")).version;

gaikan.options.directory = [__dirname];

function makeExport(name) {
  return {
    prepare: function (done) {
      done(null, gaikan.compileFile(name, __dirname, undefined, true));
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
exports.partial = {
    prepare: function (done) {
      done(null, gaikan.compileFile('partial', __dirname, undefined, true));
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  };
