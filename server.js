var http = require('http');

var express = require('express'),
	routes = require('./server/routes'),
	db = require('./server/model/db.js'),
	morgan = require('morgan'),
	fs = require('fs');

var app = express();

app.use(express.static('./public'));

var config = require('./server/config/config.json');

app.use(morgan({
	format: 'short',
	stream: fs.createWriteStream('app.log', {
		'flags': 'w'
	})
}));


app.get('/data', routes.data.getData);
app.get('/data/:id', routes.data.getDataId);

var server = http.createServer(app).listen(config.port, function() {
	console.log('App started on port ' + config.port);
});
