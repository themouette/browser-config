// this will be evaluated inside the context of the window.
// See http://casperjs.org/api.html#casper.evaluate for notes on
// the difference between casper's running environment and the
// DOM environment of the loaded page.
function testReporter(){
  // casper is webkit, so we have good DOM methods. You're
  // probably unfamiliar with them because of shitty DOMs
  // in shitty browsers.  `test` is the class applied
  // to passing tests in mocha. If you're using a different
  // runner, you'll need to figure out how to extract this
  // this kind of data from the report.
  var testNodes = document.querySelectorAll('.test');

  // testNodes is a NodeList so has no useful array methods,
  // but we can apply them, I'm returning an object that will
  // be used later:
  // {
  //    didPass: true
  //    text: 'The assertion of this test'
  // }
  return Array.prototype.map.call(testNodes, function(aTest){
    // in mocha, a passed test has a class `pass`. Normally a
    // match will return an array of matches, which is `!!`ed
    // into an appropriate boolean.
    // the assertion of the test is stored in an `h2`
    return {
      didPass: !!aTest.getAttribute('class').match(/pass/),
      text: aTest.querySelector('h2').innerText
    };
  });
}

casper.test.begin('Mocha tests', function (test) {

    // open the casper's browser and load a url. This url should be
    // where ever your unit tests are being displayed.
    casper.start('test/index.html');

    // casper.then is a promise. It ensures specific execution order.
    // give 'javascript promise' a google for some reading.
    casper.then(function(){

        // this.evaluate runs the specified function inside the context
        // of the page that casper is accessing. Think of it like popping
        // open the console in Firebug or Webkit Inspector.
        // the return value of `evaluate` here is array of tests.
        this.evaluate(testReporter).forEach(function(assertion){
            // loop through the test, calling casper's `assert` method
            // which will print to the console.
            test.assert(assertion.didPass, assertion.text);
        },this);
    });

    // run all the `then`s and call `test.renderResults` when they're done.
    casper.run(function(){
        test.done();
    });
});
