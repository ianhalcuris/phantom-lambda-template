var AWS = require('aws-sdk');
var util = require('util');
var chartProcessor = require('./chartprocessor');

exports.handler = function(event, context, callback) {

	console.log('started');
		
	const apiUrl = util.format(process.env.API_HOST + '/memo/service/insight/hub/%s/service/scatterData?offset=13&range=14&precision=5', event.hubId);
	const chartTemplate = process.env.LAMBDA_TASK_ROOT + '/activitypatternschart.html';
	
	console.log('apiUrl: ' + apiUrl);
	console.log('chartTemplate: ' + chartTemplate);
	
	chartProcessor.renderChart(apiUrl, chartTemplate, context, callback);
};
