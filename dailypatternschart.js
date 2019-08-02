var chartProcessor = require('./chartprocessor');

const CHARTS_DIR = '/charts/';

function log(method, message){
    console.log('[dailypatternschart::' + method + '] - ' + message);
}

exports.handler = function(event, context, callback) {

    log('handler', 'event: ' + JSON.stringify(event));

    // TODO use offset/range/precision from event?
    var apiUrl = process.env.MemoBaseURL + '/memo/service/insight/hub/' + event.hubId + '/service/discreteData?precision=5';
    var chartTemplate = process.env.LAMBDA_TASK_ROOT + CHARTS_DIR + 'dailypatterns.html';
	
    log('handler', 'apiUrl: ' + apiUrl);
    log('handler', 'chartTemplate: ' + chartTemplate);
	
    chartProcessor.renderChart(apiUrl, chartTemplate, context, callback);
};
