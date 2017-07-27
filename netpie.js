var MicroGear = require('microgear');
var auth = require('./config.json'); //กำหนด APPID KEY SECRET ALIAS ที่ config.js

const APPID = auth.appid;		
const KEY = auth.key;			
const SECRET = auth.secret;		
const ALIAS = auth.alias;		

var microgear = MicroGear.create({
	key: KEY,
	secret: SECRET,
	alias : ALIAS
});

exports.microgear = microgear;
exports.timeserie = [
  	{"target": "temp", "datapoints": [ ]},
  	{"target": "humid", "datapoints": [ ]}
];

var temp = 0;
var humid = 0;
var count = 0;
var isUpdate = false;

microgear.on('connected', function() {
	console.log('Connected...');
	microgear.setalias("nodejs-server");
	microgear.subscribe("/dht");
	setInterval(function() {
		if(isUpdate){
			now = Date.now();
			exports.timeserie[0].datapoints[count] = [temp, now];
			exports.timeserie[1].datapoints[count] = [humid, now];
			count++;
			isUpdate = false;
		}
	},1000);

});

microgear.on('message', function(topic,body) {
  	dht = body+"";
  	data = dht.split(",");
  	temp = data[1];
  	humid = data[0];
	isUpdate = true;
});

microgear.on('closed', function() {
	console.log('Closed...');
});

microgear.connect(APPID);



