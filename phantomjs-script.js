console.log('start phantom');

var page = require('webpage').create();
page.open('https://www.google.co.uk/', function(status) {
  var title = page.evaluate(function() {
    return document.title;
  });
  console.log('Page title is ' + title);
  phantom.exit();
});
