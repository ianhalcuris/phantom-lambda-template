console.log('started phantom');

var webPage = require('webpage');
var page = webPage.create();

page.viewportSize = {
	width: 1920,
	height: 1080
};

phantom.onError = function(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.log(msgStack.join('\n'));
  phantom.exit(1);
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

page.open('http://www.researchpipeline.com/mediawiki/images/a/a4/AmCharts_home.gif', function (status) {
  
  console.log('page opened, content=' + page.content);
	
  console.log('page opened, rendering base64...');
	
  
    var base64 = page.renderBase64('PNG');
    console.log('base64 rendered');
    console.log(base64);
  console.log('finished, calling phantom.exit');

  phantom.exit();
});
