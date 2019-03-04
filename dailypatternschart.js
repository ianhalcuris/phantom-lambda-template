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
	
	var summaryDataApiUrl = util.format(process.env.API_HOST + '/memo/service/hub/%s/summary', hubId);

	console.log('getting summary data...');
	
	// Get summary data
	getApiData(summaryDataApiUrl).then(function(summaryData) {

		console.log('got summary data: ' + summaryData);
		
		// Get discrete data
		var discreteDataApiUrl = util.format(process.env.API_HOST + '/memo/service/hub/%s/service/discreteData', hubId);
		
		getApiData(discreteDataApiUrl).then(function(discreteData) {
			
			console.log('got discrete data: ' + discreteData);
			
			const response = {
				statusCode: 200
			};
			
			callback(null, response);
			
		}, function(err) {
		
			console.log('error getting discrete data: ' + err);
			// TODO error function response
		});
		
	}, function(err) {

		console.log('error getting summary data: ' + err);
		// TODO error function response
	});
};
