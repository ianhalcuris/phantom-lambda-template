
const args = require('system').args;
const webPage = require('webpage');

var zlib = require('zlib');

var page = webPage.create();

var htmlFile = args[1];
var apiData = args[2];

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
	
	console.log('IAN-TRACE [phantom-script] - apiData = ' + apiData);
	console.log('IAN-TRACE [phantom-script] - apiData.length = ' + apiData.length);
	var inflated = zlib.inflateSync(new Buffer(apiData, 'base64')).toString();
	console.log('IAN-TRACE [phantom-script] - inflated = ' + inflated);
	console.log('IAN-TRACE [phantom-script] - inflated.length = ' + inflated.length);
	
	page.evaluate(function(inflated) {

		renderChart(inflated);

	}, inflated);
});
