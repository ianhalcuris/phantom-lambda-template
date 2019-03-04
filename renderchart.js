
function getApiData(apiUrl) {
	
	console.log('calling api, url: ' + apiUrl);

	var options = {
		url: apiUrl,
		headers: {
		  'MEMO-USER-ID': '10'
		}
	};

 	return new Promise(function(resolve, reject) {
		request.get(options, function(err, resp, body) {
			if (err) {
				reject(err);
			} else {
				resolve(body);
			}
		})
	})
}

exports.renderChart = function(apiUrl, context, callback) {

  console.log('in mytest apiUrl: ' + apiUrl);
}
