exports.whois = function (str, callback) {
	var whoisObj = {};

    var lines = str.split(/(\r?\n)/g);
    //console.log("whois:received data:" + lines.length);
    for (var i in lines){
        var line = lines[i];
        //console.log("data:" + line);
        //console.log("whois:processing line:" + (line && line.trim()) + ' '  + (line.indexOf('%') != 0) + '' +  (line.indexOf('#') != 0));
        if (line && line.trim() && line.indexOf('%') != 0 && line.indexOf('#') != 0){
            var dataValuePair =  line.split(":");
            if (dataValuePair.length >= 2) {
                var name = dataValuePair[0].trim()
                , value = dataValuePair.slice(1).join(":").trim();
                if (whoisObj[name] instanceof Array) {
                        whoisObj[name].push(value);
                } else { 
                    if (whoisObj[name] && whoisObj[name] != value) { 
                        //if there is serveral values with same name ogranizing them as array
                        var tmp = whoisObj[name];
                        whoisObj[name] = [];
                        whoisObj[name].push(tmp);
                        whoisObj[name].push(value);
                    }	
                    else 
                        whoisObj[name] = value;
                }
            }
        }
        
    }
    //console.log(lines.join(""));

	callback(null, whoisObj);
};