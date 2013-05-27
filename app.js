
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');
  
//var accessLogFile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogFile = fs.createWriteStream('error.log', {flags: 'a'});
  
var app = express();
app.configure(function(){
   //app.use(express.logger({stream: accessLogFile}));
    // all environments
   app.set('port', process.env.PORT || 3000);
   app.set('views', __dirname + '/views');
   app.set('view engine', 'ejs');
   
   app.use(express.favicon());
   //app.use(express.logger('dev'));
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(express.cookieParser());
   app.use(express.cookieSession({
      secret: 'pxue-123'}));
   
   app.use(function(req, res, next) {
     res.locals.currentUser = req.session.user;
     res.locals.error = req.session.error;
     res.locals.username = "";
     if (req.session.username) {
        res.locals.username = req.session.username;
     }
     next();
   });
   
   app.use(app.router);
   app.use(express.static(path.join(__dirname, 'public')));
  });

app.use(function (err, req, res, next) {
     if(err) {
        var meta = '[' + new Date() + '] ' + req.url + '\n';
       errorLogFile.write(meta + err.stack + '\n');
     }
   next();
  });
  
// development only
app.configure('development', function(){
  app.use(express.errorHandler());
  
});

app.get('/', routes.checkLogin);
app.get('/', routes.index);

app.get('/register', routes.checkNotLogin);
app.get('/register', routes.register);
app.post('/register', routes.doRegister);
app.get('/login', routes.checkNotLogin);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.checkLogin);
app.get('/logout', routes.logout);

app.get('/activity', routes.checkLogin);
app.get('/activity', routes.getActivityList);
app.post('/activity', routes.checkLogin);
app.post('/launch', routes.launchActivity);
app.post('/enroll', routes.checkActivityNotEnrolled);
app.post('/enroll', routes.enrollOneActivity);
app.post('/quitAc', routes.checkActivityEnrolled);
app.post('/quitAc', routes.quitOneActivity);
app.post('/closeAc', routes.checkIsActivityOwner);
app.post('/closeAc', routes.closeAnActivity);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

