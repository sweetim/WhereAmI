var http = require('http');

var express = require('express'),
	db = require('./server/model/db.js'),
	routes = require('./server/routes'),
	io = require('socket.io'),
	bodyParser = require('body-parser'),
	responseTime = require('response-time'),
	errorHandler = require('errorhandler'),
	morgan = require('morgan'),
	fs = require('fs'),
	passport = require('passport'),
	googleStrategy = require('passport-google-oauth').OAuth2Strategy,
	multer = require('multer');

var app = express();

var	config = require('./server/config/config.json')[app.get('env')];

if (app.get('env') === 'development') {
	app.use(errorHandler());
	app.use(morgan({
		format: 'dev',
		stream: fs.createWriteStream('app.log', {
			'flags': 'w'
		})
	}));
} else {
	app.use(morgan({
		format: 'short',
		stream: fs.createWriteStream('app.log', {
			'flags': 'w'
		})
	}));
}

app.use(express.static('./public'));
app.use(responseTime());
app.use(bodyParser());

app.use(multer({
	dest: './uploads/',
	onFileUploadStart: function(file) {
		console.log({
			name: file.name,
			fieldname: file.fieldname,
			oriname: file.originalname,
			enco: file.encoding,
			mime: file.mimetype,
			path: file.path,
			ext: file.extension
		});
	}
}));

var privateKey = fs.readFileSync('./ssl/whereami-key.pem', 'utf8');
var certificate = fs.readFileSync('./ssl/whereami-cert.pem', 'utf8');

var options = {
	key: privateKey,
	cert: certificate
};

/*var server = http.createServer(app).listen(config.port, function() {
	console.log('App started on port ' + config.port + ' in ' + app.get('env') + ' mode');
});*/

var server = app.listen(config.port, function() {
	console.log('App started on port ' + config.port + ' in ' + app.get('env') + ' mode');
});

/*io = io.listen(server);

io.sockets.on('connection', function(socket) {
	socket.emit('news', {
		hello: 'world'
	});
	
	socket.on('my other event', function(data) {
		console.log(data);
	});
});*/

app.use('/api', function(req, res, next) {
	console.log('here');
	next();
});

passport.use(new googleStrategy({
		clientID: "384107108130-8p0glbvghsboj8l1up4od6kj907rpkng.apps.googleusercontent.com",
    	clientSecret: "hPccySxsxQ9Xyn360A4RAe6F",
		callbackURL: "http://localhost:3000/"
	}, function(identifier, profile, done) {
		console.log("here");
		console.log(identifier);	
		console.log(profile);
		console.log(done);
	}
));

app.get('/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));
app.get('/google/return', passport.authenticate('google' , {
	successRedirect: 'http://localhost:3000/data',
	failureRedirect: 'http://localhost:3000/android'
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

//Routes for gpsData
app.get('/data', routes.data.getData);
app.post('/data', routes.data.addData);
app.get('/data/:id', routes.data.getDataId);


/*app.get('/test', function(req, res) {
	io.sockets.emit('news', {
		hello: 'here'
	});
	res.json({
		title: 'hello'
	});
});*/

app.get('/android', function(req, res) {
	var data = req.body.timestamp;
	console.log(req.body);
	console.log(data);
	res.json("heel");
});



app.post('/upload', function(req, res) {
	res.json({
		status: 'done'
	})
});

