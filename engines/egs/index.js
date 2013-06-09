"use strict";

var egs = require('egs');
var fs = require('fs');

exports.name = "EGS";
exports.version = egs.version;

var options = { cache: true, unpretty: true };

function makeSimpleExport(name) {
  var others = [].slice.call(arguments, 1);
  return {
    prepare: function (done) {
      var template = egs.fromFile(__dirname + '/' + name + '.egs', options);
      template.ready().then(function () {
        done(null, template.sync)
      }, done);
    },
    step: function (template, data, done) {
      done(null, template(data));
    }
  };
}
function makePackageExport(name) {
  var renderFilename = '/' + name + '.egs'
  return {
    prepare: function (done) {
      egs.packageFromDirectory(__dirname).then(function (templates) {
        done(null, templates);
      }, done);
    },
    step: function (templates, data, done) {
      done(null, templates.renderSync(renderFilename, data));
    }
  };
}

exports.escaped = makeSimpleExport('escaped');
exports.unescaped = makeSimpleExport('unescaped');
exports.partial = makePackageExport('partial');
exports.singleInheritance = makePackageExport('single-inheritance');
exports.multiInheritance = makePackageExport('multi-inheritance');
