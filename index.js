
var AWS = require('aws-sdk');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');
var request = require('request');

function getApiData(hubId) {

	var options = {
		url: 'https://dev-api.memohub.co.uk/memo/service/insight/hub/' + hubId + '/service/scatterData?offset=13&range=14&precision=5',
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
    	console.log('getting API data...');
    
	// Get API data
	getApiData(event.hubId).then(async function(result) {

		console.log('got API data: ' + result);
		
		var apiData = JSON.parse(result);
		
		// TODO get chart html file name from function parameter?
		var chartHtmlFile = process.env.LAMBDA_TASK_ROOT + '/' + 'chart.html';
		console.log('chartHtmlFile: ' + chartHtmlFile);

		var chartImageBase64 = '';
	
		
		    var phantom = phantomjs.exec('phantomjs-script.js', chartHtmlFile, apiData);

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
};
