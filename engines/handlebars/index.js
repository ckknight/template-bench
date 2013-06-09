var Handlebars = require('handlebars');
var fs = require('fs');

exports.name = "Handlebars";
exports.version = Handlebars.VERSION;

Handlebars.registerHelper('nice_price', function() {
  return this.price.toFixed(2);
});

Handlebars.registerPartial('_item', fs.readFileSync(__dirname + '/_item.handlebars', 'utf8'));

function makeExport(name) {
  return {
    prepare: function (done) {
      fs.readFile(__dirname + '/' + name + '.handlebars', 'utf8', function (err, text) {
        if (err) return done(err);
        done(null, Handlebars.compile(text));
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
