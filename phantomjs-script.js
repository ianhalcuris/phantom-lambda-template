console.log('start phantom');

var page = require('webpage').create();

console.log('opening page...');

page.open('https://s.codepen.io/amcharts/debug/cd2e8ce27e3a96f43bb79d5d23722d11');

console.log('after page.open');

console.log('calling page.onLoadFinished');

page.onLoadFinished = function(status) {
  var url = page.url;
  console.log("Status:  " + status);
  console.log("Loaded:  " + url);
  page.render("/tmp/example.png");
  
  console.log('image saved');
  
  phantom.exit();
};
