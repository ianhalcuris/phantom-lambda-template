var chartProcessor = require('./chartprocessor');
/*
function log(method, message){
    console.log('[activitypatternschart::' + method + '] - ' + message);
}
*/

const CHART_TEMPLATE = process.env.LAMBDA_TASK_ROOT + '/charts/activitypatterns.html';
const API_URL_PREFIX = process.env.MemoBaseURL + '/memo/service/insight/patient/';
const API_URL_SUFFIX = '/service/trend/environment?offset=6&range=7&precision=5';

exports.handler = function(event, context, callback) {

//    log('handler', 'event: ' + JSON.stringify(event));

    // TODO use offset/range/precision from event?
    var apiUrl = API_URL_PREFIX + event.patientId + API_URL_SUFFIX;
	
//    log('handler', 'apiUrl: ' + apiUrl);
//    log('handler', 'chartTemplate: ' + chartTemplate);
	
    chartProcessor.renderChart(apiUrl, CHART_TEMPLATE, context, callback);
};
