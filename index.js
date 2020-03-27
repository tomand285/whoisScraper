var Xray = require('x-ray');
var x = Xray();
var whois = require("./whois.js");

//list all IP
async function init(a,b){
	for(let i = a; i<b;i++){
		for(let j = 0; j<256;j++){
			for(let k = 0; k<256;k++){
				for(let l = 0; l<256;l++){
					let ip = i+"."+j+"."+k+"."+l;
					console.log(ip);
					scrapeWhois(ip,package => {
						//console.log(package);
						console.log(package.NetRange);
						let end = package.NetRange.end.split(".");
						i = end[0];
						j = end[1];
						k = end[2];
						l = end[3];
					});
					await sleep(5000);
				}
			}
		}
	}
}

//all
//init(1,256);

//Class A, large networks
init(1,127); //127.x.x.x is reserved for loopback or localhost

//Class B, medium networks
//init(128,192);

//Class C, smaller networks
//init(192,224);

//Class D, multicast IP address
//init(224,240);

//Class D, experimental IP address
//init(240,255);

function scrapeWhois(ip, callback){
	x('http://www.utrace.de/whois/'+ip, 'html',[
		{
			title :'title',
			text:'pre'
		}
		]).then(function(res) {
			res.forEach(item => {
				whois.whois(item.text, function (err, data){
					console.log(data);
					let NetRange = data.NetRange?Array.isArray(data.NetRange)?data.NetRange[0].split(" "):data.NetRange.split(" "):Array.isArray(data.inetnum)?data.inetnum[0].split(" "):data.inetnum.split(" ");
					let CIDR = data.CIDR;
					let OrgName = data.OrgName;
					let netname = Array.isArray(data.netname)?data.netname[0]:data.netname;
	
					let package = {
						OrgName:OrgName,
						netname:netname,
						CIDR:CIDR,
						NetRange:{
							start:NetRange[0],
							end:NetRange[NetRange.length-1]
						}
					}
	
					//console.log(package);
					callback(package);
				});
			});
		});
}

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }