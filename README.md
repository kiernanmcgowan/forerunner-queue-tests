forerunner-queue-tests
===

[![Greenkeeper badge](https://badges.greenkeeper.io/kiernanmcgowan/forerunner-queue-tests.svg)](https://greenkeeper.io/)

Baseline tests for for creating a queue module for forerunner. Passing these tests will help to make sure that your custom queue module will work to the expectations of the forerunner manager.

`npm install forerunner-queue-tests`

usage
---

There is no one way to use these tests, they are kept simple so that they can be used with just about any custom module. This example is just one way to get your tests setup.

```
// in your test script

var testSuite = require('forerunner-queue-tests');

var queue = require('../path/to/queue/object');

//
// ... perform any set up for the queue that needs to happen
//

testSuite(queue, function(results) {
  // handle any tear down that should happen

  // exit with the number of broken tests (non zero exit code is bad!)
  process.exit(results.broken);
});

```


```
// in your package.json file
{
  "scripts": {
    "test": "node path/to/test/script"
  }
}
```

And viola! `npm test` will now test your custom forerunner queue against the baseline test suite.


LICENSE
---

<MIT>

Copyright (c) 2013 Kiernan Tim McGowan (dropdownmenu)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


