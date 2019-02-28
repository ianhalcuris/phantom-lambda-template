console.log('started');

var webPage = require('webpage');
var page = webPage.create();

page.viewportSize = { width: 1920, height: 1080 };

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

	// Consider error fully handled
          return true;
};


console.log('calling page.open...');

page.open('http://amchartstestserver-env.e6gtdmyuck.eu-west-2.elasticbeanstalk.com/', function (status) {
    setTimeout(function() {
            
	      console.log('entered page.onLoadFinished, status=' + status);

  try {	
	
    console.log('rendering base64...');
	  
    var base64 = page.renderBase64('PNG');
    
    console.log('base64=' + base64);

  } catch(err) {  
    console.log('error');
    console.log('err.message=' + err.message);  
  }
	
  console.log('exiting phantom script');	
  phantom.exit();
	    
	    
    }, 5000);
});



console.log('after page.open');
