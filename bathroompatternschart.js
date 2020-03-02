var chartProcessor = require('./chartprocessor');

const CHARTS_DIR = '/charts/';
const CHART_TEMPLATE = process.env.LAMBDA_TASK_ROOT + CHARTS_DIR + 'bathroompatterns.html';
const API_URL_PREFIX = process.env.MemoBaseURL + '/memo/service/insight/hub/';
const API_URL_SUFFIX = '/service/scatterData?offset=13&range=14&precision=5';

function log(method, message){
    console.log('[bathroompatternschart::' + method + '] - ' + message);
}

exports.handler = function(event, context, callback) {

//    log('handler', 'event: ' + JSON.stringify(event));

    // TODO use offset/range/precision from event?
    var apiUrl = API_URL_PREFIX + event.hubId + API_URL_SUFFIX;
    var accessToken = event.accessToken;
	
//    log('handler', 'apiUrl: ' + apiUrl);
//    log('handler', 'CHART_TEMPLATE: ' + CHART_TEMPLATE);
	
    chartProcessor.renderChart(apiUrl, CHART_TEMPLATE, accessToken, context, callback);
};
