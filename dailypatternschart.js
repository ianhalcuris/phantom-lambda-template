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
		let items = [];

		apiData.forEach(service => {
			service.devices.forEach(device => {
				device.data.forEach(data => {
					items.push({
						start: data.start * 1000,
						end: data.end * 1000,
						gp: device.id + '_' + service.id,
						name: device.name
				    	})
				});
			});
		});
		
		console.log('chart data: ' + JSON.stringify(items));
		
		const response = {
			statusCode: 200
		};

		callback(null, response);

	}, function(err) {

		console.log('error getting discrete data: ' + err);
		// TODO error function response
	});

};
