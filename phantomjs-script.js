console.log('start phantom');

var page = require('webpage').create();
page.open('https://s.codepen.io/amcharts/debug/cd2e8ce27e3a96f43bb79d5d23722d11', function(status) {
  var title = page.evaluate(function() {
    return document.title;
  });
  console.log('Page title is ' + title);
  
  page.render('example.png');
  
  phantom.exit();
});
