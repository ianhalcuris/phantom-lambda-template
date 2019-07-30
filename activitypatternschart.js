var AWS = require('aws-sdk');
var util = require('util');
var chartProcessor = require('./chartprocessor');

exports.handler = function(event, context, callback) {

	console.log('started, patientId = ' + event.patientId);
		
	const apiUrl = util.format('https://' + process.env.API_HOSTNAME + '/memo/service/insight/patient/%s/service/trend/environment?offset=13&range=14&precision=5', event.patientId);
	const chartTemplate = process.env.LAMBDA_TASK_ROOT + '/charts/activitypatterns.html';
	
	console.log('apiUrl: ' + apiUrl);
	console.log('chartTemplate: ' + chartTemplate);
	
	chartProcessor.renderChart(apiUrl, chartTemplate, context, callback);
};
