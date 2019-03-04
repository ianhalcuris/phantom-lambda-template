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
		
			console.log('IAN-TRACE ERROR ~ ' + err);
			// TODO error function response
		});
/*
		// TODO get chart html file name from function parameter?
		var chartTemplate = process.env.LAMBDA_TASK_ROOT + '/' + process.env.CHART_TEMPLATE;
		console.log('chartTemplate: ' + chartTemplate);

		var chartImageBase64 = '';
	
		
		var phantom = phantomjs.exec('phantomjs-script.js', chartTemplate, result);

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
		
		console.log('IAN-TRACE ERROR ~ ' + err);
		// TODO error function response
    	});
	
	
	
	
	
	
	
    
	// Get API data
	getApiData(event.hubId).then(function(result) {

		console.log('got API data: ' + result);
		
		// TODO get chart html file name from function parameter?
		var chartTemplate = process.env.LAMBDA_TASK_ROOT + '/' + process.env.CHART_TEMPLATE;
		console.log('chartTemplate: ' + chartTemplate);

		var chartImageBase64 = '';
	
		
		var phantom = phantomjs.exec('phantomjs-script.js', chartTemplate, result);

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
		
		console.log('IAN-TRACE ERROR ~ ' + err);
		// TODO error function response
    	});
*/
};
