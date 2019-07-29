
const args = require('system').args;
const webPage = require('webpage');
const fs = require('fs');

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

page.open(htmlFile, function (status) {
	
	var apiData = fs.read(dataFile);
	
	page.evaluate(function(apiData) {

		renderChart(apiData);

	}, apiData);
});
