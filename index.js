
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
        
        console.log('entered phantom.onExit, code=' + code);
        
        if (code == 0) {
            
            console.log('listing files in ' + LAMBDA_TASK_ROOT);
            fs.readdirSync(LAMBDA_TASK_ROOT).forEach(file => {
              console.log(file);
            });

            console.log('listing files in /');
            fs.readdirSync('/').forEach(file => {
              console.log(file);
            });
      
        }

        callback(null, 'code='+code);
        
   });
};
