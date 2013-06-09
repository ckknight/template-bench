"use strict";

var fs = require('fs');
var VERSION = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;
var optimist = require('optimist')
  .options({
    help: { boolean: true, desc: "Show this help screen" },
    v: { alias: "version", boolean: true, desc: "template-bench v" + VERSION },
    t: { alias: "time", desc: "Amount of time per benchmark in milliseconds", default: 1000 },
    d: { alias: "variations", desc: "Amount of variations in the data", default: 25 },
    e: { alias: "engine", desc: "A comma-separated list of the engines to test" },
    r: { alias: "test", desc: "A comma-separated list of tests to run (of escaped, unescaped, partial, singleInheritance, multiInheritance)" }
  })
  .check(function (argv) {
    var time = Number(argv.time);
    if (!isFinite(time) || time <= 0) {
      throw "Must provide a positive number to --time, got " + time
    }
    var variations = Number(argv["variations"]);
    if (!isFinite(variations) || variations <= 0) {
      throw "Must provide a positive number to --variations, got " + variations
    }
  });

var enableColors = process.platform !== 'win32' && !process.env.NODE_DISABLE_COLORS;
var argv = optimist.argv;

var RED = '\x1b[31m';
var GREEN = '\x1b[32m';
var YELLOW = '\x1b[33m';
var BLUE = '\x1b[34m';
var MAGENTA = '\x1b[35m';
var CYAN = '\x1b[36m';
var RESET = '\x1b[0m';
if (!enableColors) {
  RED = GREEN = YELLOW = BLUE = CYAN = RESET = '';
}

var BLUE_THRESHOLD = 1;
var CYAN_THRESHOLD = 5;
var GREEN_THRESHOLD = 20;
var YELLOW_THRESHOLD = 100;
var RED_THRESHOLD = 900;

if (argv.help) {
  return optimist.showHelp(console.log);
}

if (argv.version) {
  return console.log("template-bench v" + VERSION);
}

var nextTick = typeof setImmediate === "function"
  ? setImmediate
  : process.nextTick;

function asyncMap(array, iterator, callback) {
  var i = 0, len = array.length;
  var results = [];
  function next() {
    if (i >= len) {
      callback(null, results);
    } else {
      iterator(array[i], function (err, value) {
        if (err) {
          callback(err);
        } else {
          results.push(value);
          nextTick(next);
        }
      }, i++);
    }
  }
  next();
}

function cmp(a, b) {
  if (a < b) {
    return -1;
  } else if (a === b) {
    return 0;
  } else {
    return 1;
  }
}

function cmpLower(a, b) {
  return cmp(a.toLowerCase(), b.toLowerCase());
}

findEngines(function (err, engines) {
  if (err) return console.error(err.stack || err);
  
  console.log("Benchmarking with " + argv["variations"] + " data variations, " + argv["time"] + " ms each");
  asyncMap(engines, benchmarkEngine, function (err, results) {
    if (err) return console.error(err.stack || err);
    
    if (results.length <= 1) {
      return;
    }
    console.log();
    console.log("------------------------------------------------------------");
    var successTotals = [];
    tests.forEach(function (test, i) {
      var successes = [];
      var failures = [];
      results.forEach(function (result, j) {
        var testResult = result[i];
        if (testResult.fail) {
          failures.push(engines[j]);
        } else {
          successes.push({
            engine: engines[j],
            rendersPerMS: testResult.rendersPerMS
          });
          successTotals[j] = (successTotals[j] || 0) + testResult.rendersPerMS;
        }
      });
      successes.sort(function (a, b) {
        return -cmp(a.rendersPerMS, b.rendersPerMS);
      });
      console.log("Results for " + test.name + ":");
      if (successes.length) {
        var fastestTime = successes[0].rendersPerMS;
        successes.forEach(function (success, j) {
          var percentSlower = (fastestTime / success.rendersPerMS - 1) * 100;
          var color =
            percentSlower <= BLUE_THRESHOLD ? BLUE :
            percentSlower <= CYAN_THRESHOLD ? CYAN :
            percentSlower <= GREEN_THRESHOLD ? GREEN :
            percentSlower <= YELLOW_THRESHOLD ? YELLOW :
            percentSlower <= RED_THRESHOLD ? RED :
            MAGENTA;
          console.log(color + "  #" + (j + 1) + ": " + success.engine.name + " " + success.engine.version + " - " + (success.rendersPerMS * 1000).toFixed(2) + " renders / s" + (success.rendersPerMS >= fastestTime ? "" : " (" + (percentSlower.toFixed(2) + "% slower)")) + RESET);
        });
      }
      if (failures.length) {
        console.log(RED + "  " + failures.map(function (engine, j) {
          return engine.name + " " + engine.version;
        }).join(", ") + " unable to render" + RESET);
      }
      console.log();
    });
  });
});

function findEngines(done) {
  fs.readdir(__dirname + '/../engines', function (err, paths) {
    if (err) return done(err);
    
    if (argv.engine) {
      var requestedEngines = String(argv.engine).toLowerCase().split(",").map(function (x) {
        return x.trim();
      });
      
      paths = paths.filter(function (path) {
        return requestedEngines.indexOf(path.toLowerCase()) != -1;
      });
    }
    
    var engines;
    try {
      engines = paths.sort(cmpLower).map(function (path) {
        return require(__dirname + "/../engines/" + path);
      });
    } catch (e) {
      return done(e);
    }
    done(null, engines);
  });
}

var randomLetter = (function () {
  var letterFrequencies = {
    // as per http://en.wikipedia.org/wiki/Letter_frequency
    a: 0.08167,
    b: 0.01492,
    c: 0.02782,
    d: 0.04253,
    e: 0.12702,
    f: 0.02228,
    g: 0.02015,
    h: 0.06094,
    i: 0.06966,
    j: 0.00153,
    k: 0.00772,
    l: 0.04025,
    m: 0.02406,
    n: 0.06749,
    o: 0.07507,
    p: 0.01929,
    q: 0.00095,
    r: 0.05987,
    s: 0.06327,
    t: 0.09056,
    u: 0.02758,
    v: 0.00978,
    w: 0.02360,
    x: 0.00150,
    y: 0.01974,
    z: 0.00074
  };
  
  var data = [];
  var current = 0;
  for (var k in letterFrequencies) {
    if (letterFrequencies.hasOwnProperty(k)) {
      var next = current + letterFrequencies[k];
      data.push({
        start: current,
        end: next,
        letter: k
      });
      current = next;
    }
  }
  
  return function() {
    var rand = Math.random();
    for (var i = 0, len = data.length; i < len; ++i) {
      var item = data[i];
      if (item.start <= rand && item.end >= rand) {
        return item.letter;
      }
    }
    return "e";
  }
}());

function generateWord(numChars, capitalized) {
  var result = [];
  var i = 0;
  if (capitalized) {
    result.push(randomLetter().toUpperCase());
    ++i;
  }
  for (; i < numChars; ++i) {
    result.push(randomLetter());
  }
  return result.join("");
}

function generateSentence(numChars) {
  var remainingChars = numChars;
  var words = [];
  while (remainingChars > 0) {
    var numCharsInWord = Math.min(
      remainingChars - 1,
      Math.floor(Math.random() * 6 + Math.random() * 6 + 1));
    words.push(generateWord(numCharsInWord, words.length == 0));
    remainingChars -= numCharsInWord + 1;
  }
  return words.join(" ") + ".";
}

function generateParagraph(numChars) {
  var remainingChars = numChars + 1;
  var sentences = [];
  while (remainingChars > 0) {
    var numCharsInSentence = Math.min(
      remainingChars - 1,
      Math.floor(Math.random() * 50 + Math.random() * 50 + 1));
    sentences.push(generateSentence(numCharsInSentence));
    remainingChars -= numCharsInSentence + 1;
  }
  return sentences.join(" ");
}

// this makes 100 data segments to feed in.
function makeStandardData() {
  var result = [];
  var variations = Number(argv["variations"]);
  for (var i = 0; i < variations; ++i) {
    result.push({
      title: generateSentence(75),
      text: generateSentence(75),
      items: (function () {
        var items = [];
        for (var j = 0; j < i; ++j) {
          items.push({
            url: "/items/" + generateWord(Math.floor(Math.sqrt(j)) + 5) + (j % 5 === 0 ? '"><xss />' : ""),
            name: generateWord(Math.floor(Math.sqrt(j)) + 5, true) + (j % 3 === 0 ? "<xss />" : ""),
            price: Math.floor(Math.random() * 1000) / 100,
            description: generateParagraph(Math.floor(Math.log(j + 2) * 50)) + (j % 2 === 0 ? "<xss />" : "")
          });
        }
        return items;
      }())
    });
  }
  return result;
}

function RegExp_escapeHTMLMaybe(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}&<>"']/g, function (x) {
    switch (x) {
    case '&': return "(?:&amp;|&#38;|&#x26;|&)";
    case '<': return "(?:&lt;|&#60;|&#x3c;|<)";
    case '>': return "(?:&gt;|&#62;|&#x3e;|>)";
    case '"': return "(?:&quot;|&#34;|&#x22;|\")";
    // single-quotes are not required to be html-quoted, but can be (but not to &apos;)
    case "'": return "(?:'|&#39;|&#x27;)";
    // slashes are not required to be html-quoted, but can be
    case "/": return "(?:\\/|&#47;|&#x2f;)";
    default: return "\\" + x;
    }
  });
}

function RegExp_escapeHTML(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}&<>"']/g, function (x) {
    switch (x) {
    case '&': return "(?:&amp;|&#38;|&#x26;)";
    case '<': return "(?:&lt;|&#60;|&#x3c;)";
    case '>': return "(?:&gt;|&#62;|&#x3e;)";
    case '"': return "(?:&quot;|&#34;|&#x22;)";
    // single-quotes are not required to be html-quoted, but can be (but not to &apos;)
    case "'": return "(?:'|&#39;|&#x27;)";
    // slashes are not required to be html-quoted, but can be
    case "/": return "(?:\\/|&#47;|&#x2f;)";
    default: return "\\" + x;
    }
  });
}

function RegExp_escape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function isValid(escape, data, html) {
  var regex = RegExp(
    /^<!DOCTYPE\s+html>\s*/.source +
    /<html\s+lang\s*=\s*["']?en-us["']?>\s*/.source +
      /<head>\s*/.source +
        /<title>\s*/.source +
          escape(data.title) +
        /\s*<\/title>\s*/.source +
      /<\/head>\s*/.source +
      /<body>\s*/.source +
        /<h1>\s*/.source +
          escape(data.text) +
        /\s*<\/h1>\s*/.source +
        (!data.items.length ?
          (/<p\s+id\s*=\s*["']?no-items["']?\s*>\s*/.source +
            /There are no items at this time\.\s*/.source +
          /<\/p>\s*/.source) :
          (/<dl\s+id\s*=\s*["']?items["']?\s*>\s*/.source +
            data.items.map(function (item) {
              return (
                /<dt>\s*/.source +
                  /<a\s+href\s*=\s*["']?/.source +
                    (escape === RegExp_escape ? RegExp_escapeHTMLMaybe : escape)(item.url) +
                  /['"]?>/.source +
                    escape(item.name) +
                  /<\/a>: \$/.source +
                  escape(item.price.toFixed(2)) +
                /\s*<\/dt>\s*/.source +
                /<dd>\s*/.source +
                  /<p>\s*/.source +
                    escape(item.description) +
                  /\s*<\/p>\s*/.source +
                /<\/dd>\s*/.source);
            }).join("") +
          /<\/dl>\s*/.source)) +
      /<\/body>\s*/.source +
    /<\/html>\s*$/.source, "i");
  if (regex.test(html)) {
    return true;
  }
  console.error("Unexpected output: " + JSON.stringify(html) + " did not match /" + regex.source + "/i");
}

function escapedValid(data, html) {
  return isValid(RegExp_escapeHTML, data, html);
}

function unescapedValid(data, html) {
  return isValid(RegExp_escape, data, html);
}

var tests = [
  { name: "Escaped", key: "escaped", dataset: makeStandardData, valid: escapedValid },
  { name: "Unescaped", key: "unescaped", dataset: makeStandardData, valid: unescapedValid },
  { name: "Partial", key: "partial", dataset: makeStandardData, valid: unescapedValid },
  { name: "Single-level inheritance", key: "singleInheritance", dataset: makeStandardData, valid: unescapedValid },
  { name: "Multi-level inheritance", key: "multiInheritance", dataset: makeStandardData, valid: unescapedValid }
];
if (argv.test) {
  var requestedTests = String(argv.test).toLowerCase().split(",").map(function (x) {
    return x.trim();
  });
  tests = tests.filter(function (x) {
    return requestedTests.indexOf(x.key.toLowerCase()) != -1;
  });
}

function benchmarkEngine(engine, done) {
  var version = engine.version;
  if (!version) {
    version = "(unknown version)";
  } else if (version.charAt(0) !== "v") {
    version = "v" + version;
  }
  engine.version = version;
  console.log();
  console.log(engine.name + " " + version + ":");
  
  asyncMap(tests, function (value, callback) {
    var key = value.key;
    process.stdout.write("  " + value.name + ": ");
    if (!engine[key] || typeof engine[key] !== "object" || typeof engine[key].step !== "function") {
      process.stdout.write("Not implemented\n");
      callback(null, { fail: true });
    }
    else {
      var prepare = engine[key].prepare || function (done) {
        done(null, null);
      };
      prepare(function (err, template) {
        if (err) {
          console.error(err.stack || err);
          callback(null, { fail: true });
        } else {
          var step = engine[key].step;
          nextTick(function () {
            var benchTimeMS = Number(argv.time);
            var totalRenders = 0;
            var dataset = value.dataset();
            asyncMap(dataset, function (data, callback, index) {
              // prime the template renderer
              step(template, data, function (err, html) {
                if (err) return callback(err);
                
                if (!value.valid(data, html)) {
                  callback(Error("Unexpected result from " + engine.name + " during " + value.name + " at dataset #" + index));
                } else {
                  callback();
                }
              });
            }, function (err) {
              if (err) return callback(err);
              
              var startTime = Date.now();
              function next() {
                asyncMap(dataset, function (data, callback) {
                  step(template, data, callback);
                }, function (err, htmls) {
                  if (err) {
                    console.log(err);
                    callback(null, { fail: true });
                  } else {
                    totalRenders += htmls.length;
                    var time = Date.now() - startTime;
                    if (time >= benchTimeMS) {
                      process.stdout.write((totalRenders / time * 1000).toFixed(2) + " renders / s\n");
                      callback(null, { rendersPerMS: totalRenders / time })
                    } else {
                      nextTick(next);
                    }
                  }
                });
              }
              next();
            })
          });
        }
      });
    }
  }, done);
}
