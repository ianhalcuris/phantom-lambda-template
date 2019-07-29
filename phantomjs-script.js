
const args = require('system').args;
const webPage = require('webpage');

var request = require('request');

var page = webPage.create();

var htmlFile = args[1];
var apiData = args[2];

function getApiData(apiUrl) {
	
	console.log('calling api: ' + apiUrl);

	var options = {
		url: apiUrl,
		headers: {
		  'MEMO-USER-ID': '10'
		}
	};

 	return new Promise(function(resolve, reject) {
		request.get(options, function(err, resp, body) {
			if (err) {
				reject(err);
			} else {
				resolve(body);
			}
		})
	})
}

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
	
	page.evaluate(function(apiData) {
		
		
	    getApiData(apiData).then(function(data) {

    		renderChart(data);
	    }
		
  	}, apiData);
});
