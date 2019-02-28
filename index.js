
var AWS = require('aws-sdk');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');

exports.handler = function(event, context, callback) {
    console.log('I am on master');
    
    var LAMBDA_TASK_ROOT = process.env.LAMBDA_TASK_ROOT;
    console.log('LAMBDA_TASK_ROOT=' + LAMBDA_TASK_ROOT);
    
    if (LAMBDA_TASK_ROOT == null) {
         LAMBDA_TASK_ROOT = '/var/task';
    }
    console.log('LAMBDA_TASK_ROOT=' + LAMBDA_TASK_ROOT);
    
    fs.readdir(LAMBDA_TASK_ROOT, function(err, items) {
        console.log(items);

        for (var i=0; i<items.length; i++) {
            console.log(items[i]);
        }
    });

    var phantom = phantomjs.exec('phantomjs-script.js', LAMBDA_TASK_ROOT, 'arg2');

    phantom.stdout.on('data', function(buf) {
        console.log('[STR] stdout "%s"', String(buf));
    });
    phantom.stderr.on('data', function(buf) {
        console.log('[STR] stderr "%s"', String(buf));
    });
    phantom.on('close', function(code) {
        console.log('[END] code', code);
    });

    phantom.on('exit', code => {
        callback(null, 'fin!!');
    });

};
