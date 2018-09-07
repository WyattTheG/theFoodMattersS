var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var elasticsearch = require('elasticsearch');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/*Mongoose Connection*/
mongoose.connect('mongodb://wyatt:1WyattPass1@ds229771.mlab.com:29771/the-food-matters', {useNewUrlParser: true});
let db = mongoose.connection;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*Elasticsearch setup*/
var client = new elasticsearch.Client({
   hosts: [ 'http://localhost:3000']
});

client.ping({
     requestTimeout: 30000,
 }, function(error) {
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });

 /*Index All items in DB inventory to client index*/
 






module.exports = app;
