const AWS = require('aws-sdk');
const util = require('util');
const chartProcessor = require('./chartprocessor');


exports.handler = function(event, context, callback) {

	console.log('started');
	
	const apiUrl = util.format(process.env.API_HOST + '/memo/service/insight/hub/%s/service/discreteData?precision=5', hubId);
	const chartTemplate = process.env.LAMBDA_TASK_ROOT + '/dailypatternschart.html';
	
	console.log('apiUrl: ' + apiUrl);
	console.log('chartTemplate: ' + chartTemplate);
	
	chartProcessor.handler(apiUrl, chartTemplate, context, callback);
};
