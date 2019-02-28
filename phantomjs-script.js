console.log('started');

var webPage = require('webpage');
var page = webPage.create();

page.viewportSize = {
	width: 640,
	height: 480
};

console.log('opening page...');

page.open('http://amchartstestserver-env.e6gtdmyuck.eu-west-2.elasticbeanstalk.com/', function (status) {

  console.log('page opened, content=' + page.content);
	
  var base64 = page.renderBase64('PNG');
  console.log('base64=' + base64);
  phantom.exit();
});
