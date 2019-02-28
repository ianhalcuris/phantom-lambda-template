console.log('started');

var webPage = require('webpage');
var page = webPage.create();

page.viewportSize = {
	width: 640,
	height: 480
};

console.log('opening page...');

page.open('http://phantomjs.org', function (status) {

  console.log('page opened, rendering base64...');
	
  var base64 = page.renderBase64('PNG');
  console.log('base64=' + base64);
  phantom.exit();
});
