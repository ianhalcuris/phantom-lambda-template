
const args = require('system').args;
const webPage = require('webpage');
const fs = require('fs');

var page = webPage.create();

var htmlFile = args[1];
var dataFile = args[2];

page.onCallback = function(data) {

	var chartdiv = page.evaluate(function () {
		return document.getElementById('chartdiv').getBoundingClientRect();
	});
	page.clipRect = {
		top: chartdiv.top,
		left: chartdiv.left,
		width: chartdiv.width,
		height: chartdiv.height
	};
	console.log(
		page.renderBase64('PNG')
	);

	phantom.exit();
};

page.onError = function(msg, trace) {
  console.log('IAN-TRACE page.onError::msg : ' + msg);
  if (trace && trace.length) {
    var msgStack = ['IAN-TRACE page.onError::stack : '];
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
    console.log(msgStack.join('\n'));
  }
};
phantom.onError = function(msg, trace) {
  console.log('IAN-TRACE phantom.onError::msg : ' + msg);
  if (trace && trace.length) {
    var msgStack = ['IAN-TRACE phantom.onError::stack : '];
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
    console.log(msgStack.join('\n'));
  }
  phantom.exit(1);
};



page.open(htmlFile, function (status) {
	
	var apiData = fs.read(dataFile);
	
	page.evaluate(function(apiData) {

		renderChart(apiData);

	}, apiData);
});

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('IAN-TRACE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};
