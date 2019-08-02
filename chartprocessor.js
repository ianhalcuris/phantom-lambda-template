var AWS = require('aws-sdk');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');
var request = require('request');
const util = require('util');
var uuid = require('uuid');

var PropertiesReader = require('properties-reader');
var authProps = PropertiesReader('./auth.properties');

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
    var audience = authProps.get('audience');
    log('login', 'audience: ' + audience);
	
    var options = {
        url: 'https://alcuris.eu.auth0.com/oauth/token',
	headers: {
  	    'Content-Type': 'application/json'
	},
        body: JSON.stringify({
	    password: 'AlCuRiS123', 
	    audience: 'https://dev-api.memohub.co.uk', 
	    grant_type: 'http://auth0.com/oauth/grant-type/password-realm', 
	    scope: 'openid contacts', 
	    realm: 'memo-insight-dev', 
	    client_secret: '_G4ybbmZhYPR_s1mqw0YMXMBcFdQHEM3QGXe8saYhnK1cLQlSHUuCX0m7sRMsmhL', 
	    client_id: 'AqJzLKWDlH8S6p0Jz4cWbM9QvchbeacK', 
	    username: 'system@alcuris.co.uk'
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
	
    log('renderChart', 'apiUrl:' + apiUrl);
    log('renderChart', 'chartTemplate:' + chartTemplate);
	
    // Login to Auth0
    login().then(function(accessToken) {
	    
        // Call Memo API
        apiGet(apiUrl, accessToken).then(function(apiResponse) {

            log('renderChart', 'apiResponse:' + apiResponse);

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
	    	
	    phantom.on('close', function(code) {
		console.log('code', code);
	    });

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
