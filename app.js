var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  app = express();

app.configure(function () {
  app.use(express.bodyParser());
});

// all environments
app.set('port', process.env.PORT || 3001);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'uploads')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

app.get('/photos',  routes.getData);
app.post('/photos',  routes.upload);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
