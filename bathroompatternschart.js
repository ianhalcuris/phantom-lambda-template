var chartProcessor = require('./chartprocessor');

const CHARTS_DIR = '/charts/';

function log(method, message){
    console.log('[bathroompatternschart::' + method + '] - ' + message);
}

exports.handler = function(event, context, callback) {

    log('handler', 'event: ' + JSON.stringify(event));

    // TODO use offset/range/precision from event?
    var apiUrl = process.env.MemoBaseURL + '/memo/service/insight/hub/' + event.hubId + '/service/scatterData?offset=13&range=14&precision=5';
    var chartTemplate = process.env.LAMBDA_TASK_ROOT + CHARTS_DIR + 'bathroompatterns.html';
	
    log('handler', 'apiUrl: ' + apiUrl);
    log('handler', 'chartTemplate: ' + chartTemplate);
	
    chartProcessor.renderChart(apiUrl, chartTemplate, context, callback);
};
