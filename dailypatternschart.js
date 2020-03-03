var chartProcessor = require('./chartprocessor');

const CHARTS_DIR = '/charts/';
const CHART_TEMPLATE = process.env.LAMBDA_TASK_ROOT + CHARTS_DIR + 'dailypatterns.html';
const API_URL_PREFIX = process.env.MemoBaseURL + '/memo/service/insight/hub/';
const API_URL_SUFFIX = '/service/discreteData?precision=5';

function log(method, message){
    console.log('[dailypatternschart::' + method + '] - ' + message);
}

exports.handler = function(event, context, callback) {

//    log('handler', 'event: ' + JSON.stringify(event));
	
    if (event["isKeepalivePing"]) {
	var response = {
	    statusCode: 200
	};
	callback(null, response);
    } else {

    	// TODO use offset/range/precision from event?
    	var apiUrl = API_URL_PREFIX + event.hubId + API_URL_SUFFIX;
	
    	var accessToken = event.accessToken;
//      log('handler', 'accessToken: ' + accessToken);
	
//      log('handler', 'apiUrl: ' + apiUrl);
//      log('handler', 'chartTemplate: ' + chartTemplate);
	
    	chartProcessor.renderChart(apiUrl, CHART_TEMPLATE, accessToken, context, callback);
    }
};
