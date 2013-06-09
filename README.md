## template-bench

Last updated June 9, 2013.

This is meant to be a comprehensive benchmarking test for various templating
engines.

The data provided to each benchmark cycles through various different inputs so
as to cover each possible output within the template.

All tests have a similar output, but should go about them in different ways.

Provided data that looks like:

    {
      title: "Everybody loves fruit",
      text: "List of fruits",
      items: [
        {
          url: "/items/apple",
          name: "Apple",
          price: 1.20,
          description: "I need my red delicious."
        },
        {
          url: "/items/banana",
          name: "Banana",
          price: 0.43,
          description: "Curved yellow fruit."
        }
      ]
    }

Output something that looks like the following:

    <!DOCTYPE html>
    <html lang="en-us">
      <head>
        <title>Everybody loves fruit</title>
      </head>
      <body>
        <h1>List of fruits</h1>
        <dl id="items">
          <dt><a href="/items/apple">Apple</a>: $1.20</dt>
          <dd><p>I need my red delicious.</p></dd>
          <dt><a href="/items/banana">Banana</a>: $0.43</dt>
          <dd><p>Curved yellow fruit.</p></dd>
        </dl>
      </body>
    </html>

If the `projects` array is empty, then it should look like the following:

    <!DOCTYPE html>
    <html lang="en-us">
      <head>
        <title>Everybody loves fruit</title>
      </head>
      <body>
        <h1>List of fruits</h1>
        <p id="no-items">There are no items at this time.</p>
      </body>
    </html>

Unneeded whitespace may be omitted, but extra whitespace (such as before `:`) or lack of whitespace (such as after `:`) is a failure.

Templates are provided time to prepare if needed before running a series of tests on the prepared template with varying data.

All engines tested must be installable with `npm` and run on node's latest released version.

Engines are expected to use caching in order to not have to recompile each step. There is a prepare callback that can be run at the beginning which will not count against any score, and a full set of data will run through the template before scoring, which will have its output validated.

### Installing

The easiest way is

    # npm install -g template-bench

### Command line

Once you have `template-bench` installed, you can run the binary

    # template-bench --help
    
    --help            Show this help screen                                                                                         [boolean]
    -v, --version     template-bench v0.1.0                                                                                         [boolean]
    -t, --time        Amount of time per benchmark in milliseconds                                                                  [default: 1000]
    -d, --variations  Amount of variations in the data                                                                              [default: 25]
    -e, --engine      A comma-separated list of the engines to test                                                               
    -r, --test        A comma-separated list of tests to run (of escaped, unescaped, partial, singleInheritance, multiInheritance)

As the number of variations increases, the size of the input data grows as well, so for 50 variations, it will have data with 0 items all the way up to 50 items.

Engines can go over their allotted time in order to run a full set of variations, so that there is no bias.

### Unescaped output

Allow all the input strings to be unescaped, so `<script>` stays `<script>`.

### Escaped output

All input strings must be escaped, so `<script>` should turn into `&lt;script&gt;`.

### Partials

Assuming the engine supports it, There should be a test where each `<dt /><dd />` pair is in its own template which is included by the parent template. Text is unescaped.

### Single-level inheritance

Assuming the engine supports it, there should be a test where in two separate templates, one inherits from the other. The contents of the `<body>` tag should be defined separately from the rest of the layout. Text is unescaped.

### Multi-level inheritance

Assuming the engine supports it, there should be a test where one template inherits from another which itself inherits from another. The contents of the `<body>` tag should be the middle template and the contents of the `<body>` excluding the `<h1>` tag should be the lowest template. Text is unescaped.

### Contributing

If you want to change an engine or add a new one, [submit a pull request](https://github.com/ckknight/template-bench). If you want to suggest a new benchmark or have any other suggestions, [submit an issue](https://github.com/ckknight/template-bench/issues).
