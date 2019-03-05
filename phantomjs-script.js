
var args = require('system').args;
var webPage = require('webpage');

var page = webPage.create();

var htmlFile = args[1];
var apiData = args[2];

page.open(htmlFile, function (status) {
	
	page.evaluate(function(apiData) {

    		renderChart(apiData);
		
  	}, apiData);
	
    	setTimeout(function() {

		var chartdiv = page.evaluate(function () {
            		return document.getElementById('chartdiv').getBoundingClientRect();
        	});

		page.clipRect = {
			top: chartdiv.top,
			left: chartdiv.left,
		    	width: chartdiv.width,
		    	height: chartdiv.height
		};

        	console.log(
			page.renderBase64('PNG')
		);
	    
        	phantom.exit();
	        
    	}, 5000); // TODO optimise this timeout 
});
