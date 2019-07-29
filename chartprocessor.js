var AWS = require('aws-sdk');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');
var request = require('request');
const util = require('util');
var uuid = require('uuid');

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

exports.renderChart = function(apiUrl, chartTemplate, context, callback) {	
	
	console.log('entered chart processor');
	
	console.log('chartprocessor apiUrl:' + apiUrl);
	console.log('chartprocessor chartTemplate:' + chartTemplate);
	
	getApiData(apiUrl).then(function(data) {

		console.log('got data: ' + data);
				
		var chartImageBase64 = '';
		
		/*
		    Can't pass the data in here because it may be too large Need 
		    to either [1] get the data in the phantom process or [2] save 
		    the data to file and load it in the phantom process.
		*/
		
		// __dirname = /var/task
		console.log('IAN-TRACE [chartprocessor] - __dirname = ' + __dirname);

		var dataFile = '../../tmp/' + uuid.v4() + '.json';

		console.log('IAN-TRACE [chartprocessor] - dataFile = ' + dataFile);
		
		fs.writeFileSync(dataFile, data);
		
		fs.readdirSync('../../tmp/').forEach(function (name) {
			console.log('IAN-TRACE [chartprocessor] - tmp file = ' + name);
		});
		
		const data = fs.readFileSync(dataFile, 'utf8');
		
		console.log('IAN-TRACE [chartprocessor] - data = ' + data);
		
		var phantom = phantomjs.exec('phantomjs-script.js', chartTemplate, dataFile);

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
