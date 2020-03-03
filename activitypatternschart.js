var chartProcessor = require('./chartprocessor');

function log(method, message){
    console.log('[activitypatternschart::' + method + '] - ' + message);
}

const CHART_TEMPLATE = process.env.LAMBDA_TASK_ROOT + '/charts/activitypatterns.html';
const API_URL_PREFIX = process.env.MemoBaseURL + '/memo/service/insight/patient/';
const API_URL_SUFFIX = '/service/trend/environment?offset=6&range=7&precision=5';

exports.handler = function(event, context, callback) {

//    log('handler', 'event: ' + JSON.stringify(event));
	
    if (event["isKeepalivePing"]) {
	var response = {
	    statusCode: 200
	};
	callback(null, response);
    } else {
	    
    	// TODO use offset/range/precision from event?
    	var apiUrl = API_URL_PREFIX + event.patientId + API_URL_SUFFIX;
	
    	var accessToken = event.accessToken;
//      log('handler', 'accessToken: ' + accessToken);
	
//      log('handler', 'apiUrl: ' + apiUrl);
//      log('handler', 'chartTemplate: ' + chartTemplate);
	
    	chartProcessor.renderChart(apiUrl, CHART_TEMPLATE, accessToken, context, callback);
    }
};
