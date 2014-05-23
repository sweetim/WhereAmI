var http = require('http');

var express = require('express'),
	db = require('./server/model/db.js'),
	routes = require('./server/routes'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	fs = require('fs');


var app = express();

app.use(express.static('./public'));
app.use(bodyParser());

var config = require('./server/config/config.json');

app.use(morgan({
	format: 'short',
	stream: fs.createWriteStream('app.log', {
		'flags': 'w'
	})
}));

//Routes for user
app.get('/user', routes.user.index);
app.get('/user/new', routes.user.create);
app.post('/user/new', routes.user.doCreate);
/*app.get('/user/edit', routes.user.edit);
app.post('/user/edit', routes.user.doEdit);
app.get('/user/delete', routes.user.confirmDelete);
app.post('/user/delete', routes.user.doDelete);

app.get('/login', routes.user.login);
app.post('/login', routes.user.doLogin);
app.get('/logout', routes.user.doLogout);*/

//Routes for project
app.get('/project/new', routes.project.create);
app.post('/project/new', routes.project.doCreate);
app.get('/project/:id', routes.project.displayInfo);
/*app.get('/project/edit/:id', routes.project.edit);
app.post('/project/edit/:id', routes.project.doEdit);
app.get('/project/delete/:id', routes.project.confirmDelete);
app.post('/project/delete/:id', routes.project.doDelete);*/

app.get('/data', routes.data.getData);
app.get('/data/:id', routes.data.getDataId);

var server = http.createServer(app).listen(config.port, function() {
	console.log('App started on port ' + config.port);
});
