var fest = require('fest');

exports.name = "fest";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/fest/package.json")).version;

function makeExport(name) {
  return {
    prepare: function (done) {
      done(null, new Function('return ' + fest.compile(__dirname + '/' + name + '.fest', {beautify: false}))());
    },
    step: function (compiled, data, done) {
      done(null, compiled(data));
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
exports.partial = makeExport('partial');
