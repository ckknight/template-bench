var fs = require('fs');
var dust = require('dustjs-linkedin');

exports.name = "dust";
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/../../node_modules/dustjs-linkedin/package.json")).version;

dust.filters.nicePrice = function(price) {
  return price.toFixed(2);
};

function prepare(name, done) {
  fs.readFile(__dirname + '/' + name + '.dust', 'utf8', function (err, text) {
    if (err) return done(err);
    var compiled = dust.compile(text, name);
    dust.loadSource(compiled);
    done(null, name);
  });
}

function makeExport(name, extra) {
  return {
    prepare: function (done) {
      if (!extra) {
        extra = function (callback) {
          callback();
        };
      }
      extra(function (err) {
        if (err) return done(err);
        prepare(name, done);
      });
    },
    step: function (name, data, done) {
    	dust.render(name, data, done);
    }
  };
}

exports.escaped = makeExport('escaped');
exports.unescaped = makeExport('unescaped');
exports.partial = makeExport('partial', function(done) {
  prepare('_item', done);
});
exports.singleInheritance = makeExport('single-inheritance', function(done) {
  prepare('inheritance-layout', done);
});
exports.multiInheritance = makeExport('multi-inheritance', function(done) {
  prepare('inheritance-layout', function (err) {
    if (err) return done(err);
    prepare('multi-inheritance-sublayout', done);
  });
});
