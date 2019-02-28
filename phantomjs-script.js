console.log('started phantom');

var webPage = require('webpage');
var page = webPage.create();

page.viewportSize = {
	width: 1920,
	height: 1080
};

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};

page.onResourceTimeout = function(e) {
  console.log('timeout, errorCode=' + e.errorCode);   // it'll probably be 408 
  console.log('timeout, errorString=' + e.errorString); // it'll probably be 'Network timeout on resource'
  console.log('timeout, url=' + e.url);         // the url whose request timed out
  phantom.exit(1);
};


console.log('opening page...');

page.open('http://s.codepen.io/amcharts/debug/cd2e8ce27e3a96f43bb79d5d23722d11', function (status) {
  
  console.log('page opened, content=' + page.content);
	
  console.log('page opened, rendering base64...');
  
  var base64 = page.renderBase64('PNG');
  
  console.log('base64 rendered');
  
  console.log(base64);
  phantom.exit();
});
