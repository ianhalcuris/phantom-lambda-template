
var AWS = require('aws-sdk');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');

exports.handler = function(event, context, callback) {
    
    console.log('started');
    
    // TODO get chart html file name from function parameter?
    var chartHtmlFile = process.env.LAMBDA_TASK_ROOT + '/' + 'chart.html';
    console.log('chartHtmlFile: ' + chartHtmlFile);
    
    var chartImageBase64 = '';

    var phantom = phantomjs.exec('phantomjs-script.js', chartHtmlFile, 'otherArg');

    phantom.stdout.on('data', function(buf) {
        var base64Data = String(buf);
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
            body: base64,
            isBase64Encoded : true,
        };
        
        // TODO error response

        callback(null, response);
   });
};
