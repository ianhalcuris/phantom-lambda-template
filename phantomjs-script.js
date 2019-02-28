console.log('started phantom');

var webPage = require('webpage');
var page = webPage.create();

page.viewportSize = {
	width: 1920,
	height: 1080
};

console.log('opening page...');

page.open('http://phantomjs.org', function (status) {
  
  console.log('page opened, rendering base64...');
  
  var base64 = page.renderBase64('PNG');
  
  console.log('base64 rendered');
  
  console.log(base64);
  phantom.exit();
});
