var whois = require('whois-ux');

whois.whois('139.130.4.5', function (err, data){
	console.log(JSON.stringify(data));
});