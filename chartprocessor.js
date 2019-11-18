var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');
var request = require('request');
var uuid = require('uuid');
var propertiesReader = require('properties-reader');
var authProps = propertiesReader('./auth.properties');

const TMP_DIR = '../../tmp/';

function apiGet(url, accessToken) {
	
    log('apiGet', 'url: ' + url);
    log('apiGet', 'accessToken: ' + accessToken);
	
    var options = {
        url: url,
	headers: {
            'Authorization': 'Bearer ' + accessToken
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

function login() {

    log('login', 'Logging in...');
	
    var options = {
        url: 'https://' + authProps.get('domain') + '/oauth/token',
	headers: {
  	    'Content-Type': 'application/json'
	},
        body: JSON.stringify({
      	    audience: authProps.get('audience'),
	    client_id: authProps.get('client_id'),
	    client_secret: authProps.get('client_secret'),
	    grant_type: authProps.get('grant_type'),
	    realm: authProps.get('realm'),
	    scope: authProps.get('scope'),
	    username: process.env.SysUser,
	    password: process.env.SysPassword
	})
    };

    return new Promise(function(resolve, reject) {
	request.post(options, function(err, resp, body) {
	    if (err) {
		reject(err);
	    } else {
		resolve(JSON.parse(body).access_token);
	    }
	})
    })
}

function log(method, message) {
    console.log('[chartprocessor::' + method + '] - ' + message);
}

exports.renderChart = function(apiUrl, chartTemplate, context, callback) {	
	
    log('renderChart', 'apiUrl: ' + apiUrl);
    log('renderChart', 'chartTemplate: ' + chartTemplate);
	
    // Login to Auth0
    login().then(function(accessToken) {
	    
        // Call Memo API
        apiGet(apiUrl, accessToken).then(function(apiResponse) {

            log('renderChart', 'apiResponse: ' + apiResponse);

	    var dataFile = TMP_DIR + uuid.v4() + '.json';
	    var chartImageBase64 = '';
		
	    log('renderChart', 'dataFile: ' + dataFile);

	    // Write API response to tmp file
	    fs.writeFileSync(dataFile, apiResponse);

	    var phantom = phantomjs.exec('phantomjs-script.js', chartTemplate, dataFile);

	    phantom.stdout.on('data', function(buf) {
		var base64Data = String(buf).replace(/\n$/, '');
	        log('renderChart', 'base64Data: ' + base64Data);
		chartImageBase64 += base64Data;
            });

	    phantom.stderr.on('data', function(buf) {
		console.log('stderr "%s"', String(buf));
	    });
/*	    	
	    phantom.on('close', function(code) {
		console.log('code', code);
	    });
*/
	    phantom.on('exit', code => {
		    
      		log('renderChart', 'phantomjs exit, code: ' + code);

		var response = {
		    statusCode: 200,
		    headers: {'Content-type' : 'image/png'},
		    body: chartImageBase64,
		    isBase64Encoded : true,
		};

		// TODO error response
		callback(null, response);
	    });
	
	}, function(err) {
	
	    // TODO error function response
	    log('renderChart', 'apiGet error: ' + err);
	})
    
    }, function(err) {
        
	// TODO error function response
	log('renderChart', 'login error: ' + err);
    });
};
