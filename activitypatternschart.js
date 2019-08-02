var chartProcessor = require('./chartprocessor');

function log(method, message){
    console.log('[activitypatternschart::' + method + '] - ' + message);
}

exports.handler = function(event, context, callback) {

    log('handler', 'event: ' + JSON.stringify(event));

    // TODO use offset/range/precision from event?
    var apiUrl = util.format(process.env.MemoBaseURL + '/memo/service/insight/patient/%s/service/trend/environment?offset=13&range=14&precision=5', event.patientId);
    var chartTemplate = process.env.LAMBDA_TASK_ROOT + '/charts/activitypatterns.html';
	
    log('handler', 'apiUrl: ' + apiUrl);
    log('handler', 'chartTemplate: ' + chartTemplate);
	
    chartProcessor.renderChart(apiUrl, chartTemplate, context, callback);
};
