
var args = require('system').args;
var webPage = require('webpage');

var page = webPage.create();

var htmlFile = args[1];
var apiData = args[2];

// TODO pass in as args depending on chart type?
page.viewportSize = { width: 1920, height: 1080 };

page.open(htmlFile, function (status) {
	
	page.evaluate(function(apiData) {
    		renderChart(apiData);
  	}, apiData);
	
    	setTimeout(function() {
		
        	console.log(
			page.renderBase64('PNG')
		);
	    
        	phantom.exit();
	        
    	}, 5000); // TODO optimise this timeout 
});
