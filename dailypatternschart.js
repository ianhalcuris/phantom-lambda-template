var AWS = require('aws-sdk');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');
var request = require('request');
const util = require('util');



function getApiData(apiUrl) {
	
	console.log('calling api, url: ' + apiUrl);

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

exports.handler = function(event, context, callback) {
	
	console.log('started');
    
	var hubId = event.hubId;
	
    	console.log('hubId: ' + hubId);

	console.log('getting API data...');

	var apiUrl = util.format(process.env.API_HOST + '/memo/service/insight/hub/%s/service/discreteData?precision=5', hubId);

	getApiData(apiUrl).then(function(result) {

		console.log('got API data: ' + result);

		console.log('assembling chart data...');
		
		var apiData = JSON.parse(result);

		// Assemble chart data
		let chartData = [];
		apiData.forEach(service => {
			service.devices.forEach(device => {
				device.data.forEach(data => {
					chartData.push({
						start: data.start * 1000,
						end: data.end * 1000,
						category: device.name
				    	})
				});
			});
		});
		//						gp: device.id + '_' + service.id,
		
		console.log('chart data: ' + JSON.stringify(chartData));
		
		
		
		var chartTemplate = process.env.LAMBDA_TASK_ROOT + '/dailypatternschart.html';
		console.log('chart template: ' + chartTemplate);

		var chartImageBase64 = '';

		var phantom = phantomjs.exec('phantomjs-script.js', chartTemplate, chartData);

	    	phantom.stdout.on('data', function(buf) {
			var base64Data = String(buf).replace(/\n$/, '');
			console.log('got base64 data: ' + base64Data);
			chartImageBase64 += base64Data;
	    	});

	    	phantom.stderr.on('data', function(buf) {
			console.log('stderr "%s"', String(buf));
	    	});
	    	phantom.on('close', function(code) {
			console.log('code', code);
	    	});

	    	phantom.on('exit', code => {

			console.log('phantomjs exit, code: ' + code);

			const response = {
				statusCode: 200,
				headers: {'Content-type' : 'image/png'},
				body: chartImageBase64,
				isBase64Encoded : true,
			};

			// TODO error response

			callback(null, response);
		});
		


	}, function(err) {

		console.log('error getting discrete data: ' + err);
		// TODO error function response
	});

};
