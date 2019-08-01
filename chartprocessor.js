var AWS = require('aws-sdk');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');
var request = require('request');
const util = require('util');
var uuid = require('uuid');

const TMP_DIR = '../../tmp/';

function getApiData(apiUrl) {
	
	console.log('calling api: ' + apiUrl);
	
	// TODO login system user
	//      use same API env vars as other lambdas
	request.post({
  		headers: {'content-type' : 'application/json'},
		url:     'https://alcuris.eu.auth0.com/oauth/token',
		body:    '{
				"grant_type": "client_credentials"
				"client_id": "AqJzLKWDlH8S6p0Jz4cWbM9QvchbeacK"
    				"client_secret": "_G4ybbmZhYPR_s1mqw0YMXMBcFdQHEM3QGXe8saYhnK1cLQlSHUuCX0m7sRMsmhL"
    				"audience": "https://alcuris.eu.auth0.com/api/v2/"
			  }'
	}, function(error, response, body){
  		console.log('auth0 response = ' + body);
	});

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

exports.renderChart = function(apiUrl, chartTemplate, context, callback) {	
	
	console.log('[chart-processor] apiUrl:' + apiUrl);
	console.log('[chart-processor] chartTemplate:' + chartTemplate);
	
	getApiData(apiUrl).then(function(data) {

		console.log('[chart-processor] - data: ' + data);
		console.log('[chart-processor] - data.length: ' + data.length);
		
		var dataFile = TMP_DIR + uuid.v4() + '.json';
		var chartImageBase64 = '';
		
		console.log('[chart-processor] - dataFile: ' + dataFile);
		
		fs.writeFileSync(dataFile, data);

		var phantom = phantomjs.exec('phantomjs-script.js', chartTemplate, dataFile);

	    	phantom.stdout.on('data', function(buf) {
			var base64Data = String(buf).replace(/\n$/, '');
			console.log('[chart-processor] - got base64 data: ' + base64Data);
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
