console.log('start phantom');

var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';

var url = 'https://www.google.co.uk/';

console.log('url=' + url);

page.open(url);

console.log('after page.open');

page.onLoadFinished = function(status) {
  console.log('entered page.onLoadFinished, status=' + status);
  // Do other things here...
  
  console.log('rendering base64');
    
  // Return image of the page as base64-encoded string
  //var base64 = page.renderBase64('JPEG');
    
  //console.log('base64=' + base64);
  
  console.log('all done, calling phantom.exit');
  
  phantom.exit();
  
  console.log('after phantom.exit');
  
};
