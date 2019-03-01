
var args = require('system').args;
var webPage = require('webpage');
var page = webPage.create();
var chartHtmlFile = args[1];
var apiData = args[2];

// TODO pass in as args depending on chart type?
page.viewportSize = { width: 1920, height: 1080 };

page.onConsoleMessage = function(msg) {
  console.log('console msg: ' + msg);
}

page.open(chartHtmlFile, function (status) {
	
	// apiData is defined here
	
	page.evaluate(function(apiData) {
		
		// apiData is NOT defined here
		
		console.log('in page.evaluate, apiData=' + apiData);
		
    		renderChart(apiData);
  	}, apiData);
	
    	setTimeout(function() {
		
        	var base64 = page.renderBase64('PNG');
        	console.log(base64);
	    
        	phantom.exit();
	        
    	}, 5000); // TODO tweak this timeout 
});
