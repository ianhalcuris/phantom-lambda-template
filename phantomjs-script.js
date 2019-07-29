
const args = require('system').args;
const webPage = require('webpage');
var fs = require('fs');

var page = webPage.create();

var htmlFile = args[1];
var dataFile = args[2];

page.onCallback = function(data) {

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
};

page.onError = function(msg, trace) {

  console.log('IAN-TRACE [phantom-script::onError] - msg = ' + msg);

};

page.onResourceError = function(resourceError) {
      console.log('IAN-TRACE [phantom-script::resourceError] - resourceError = ' + resourceError);
};

page.open(htmlFile, function (status) {
	
	console.log('IAN-TRACE [phantom-script] - status = ' + status);
	console.log('IAN-TRACE [phantom-script] - dataFile = ' + dataFile);
	
	fs.readFile(dataFile, function(err, data) {
	    
		console.log('IAN-TRACE [phantom-script] - data = ' + data);
		console.log('IAN-TRACE [phantom-script] - err = ' + err);
			
		page.evaluate(function(data) {

			renderChart(data);

		}, data);
  	});
});
