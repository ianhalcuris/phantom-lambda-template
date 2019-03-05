var AWS = require('aws-sdk');
var util = require('util');
var chartProcessor = require('./chartprocessor');

exports.handler = function(event, context, callback) {

	console.log('started');
		
	const apiUrl = util.format('https://' + process.env.API_HOSTNAME + '/memo/service/insight/hub/%s/service/scatterData?offset=13&range=14&precision=5', event.hubId);
	const chartTemplate = process.env.LAMBDA_TASK_ROOT + '/charts/activitypatterns.html';
	
	console.log('apiUrl: ' + apiUrl);
	console.log('chartTemplate: ' + chartTemplate);
	
	chartProcessor.renderChart(apiUrl, chartTemplate, context, callback);
};
