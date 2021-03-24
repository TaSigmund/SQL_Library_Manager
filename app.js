var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

//db setup
const db = require('./models/index.js')
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;

//db sync
(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }})()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let error404 = new Error();
  error404.status = 404;
  error404.message = 'The page you are looking for does not exist';
  next(error404);
});

// error handler
app.use(function(err, req, res, next) {
  err.message = err.message || "Oh no! An error has occured." //sets error message

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500); //checks whether there already is an error status

  (err.status === 404)?
  res.render('page-not-found'): //for 404s
  res.render('error', {error: err}); //for all other errors
});

module.exports = app;
