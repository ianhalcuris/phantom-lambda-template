
var AWS = require('aws-sdk');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');

exports.handler = function(event, context, callback) {
    console.log('I am on master');
    
    var LAMBDA_TASK_ROOT = process.env.LAMBDA_TASK_ROOT;
    if (LAMBDA_TASK_ROOT == null) {
        LAMBDA_TASK_ROOT = '/';
    } else {
        LAMBDA_TASK_ROOT = LAMBDA_TASK_ROOT + '/';
    }
    console.log('LAMBDA_TASK_ROOT=' + LAMBDA_TASK_ROOT);
    
var base64 = '';

    var phantom = phantomjs.exec('phantomjs-script.js', LAMBDA_TASK_ROOT, 'arg2');

    phantom.stdout.on('data', function(buf) {
       
        var content = String(buf);
        
        base64 += content;
        
        console.log('[STR] stdout "%s"', content);
    });
    phantom.stderr.on('data', function(buf) {
        console.log('[STR] stderr "%s"', String(buf));
    });
    phantom.on('close', function(code) {
        console.log('[END] code', code);
    });

    phantom.on('exit', code => {
        
        console.log('entered phantom.onExit, code=' + code);
        
        const response = {
            statusCode: 200,
            headers: {'Content-type' : 'image/png'},
            body: base64,
            isBase64Encoded : true,
        };

        callback(null, response);
        
   });
};
