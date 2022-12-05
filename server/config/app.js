let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session'); 
let passport = require('passport'); 
let passportLocal = require('passport-local')
let localStrategy = passportLocal.Strategy; 
let flash = require('connect-flash');
//create a user model instance

let userModel = require("../models/user"); 
let User = userModel.User; 

//mongodb config
let mongoose = require('mongoose');
let DB = require('./db');

// point mongoose to DB URI
mongoose.connect(DB.URI);
let mongDB = mongoose.connection;
mongDB.on('error',console.error.bind(console,'Connection Error:'));
mongDB.once('open', ()=> {
  console.log('connected to the MongoDB');
});
let app = express();
//set up session
app.use(session({
  secret:"SomeSecret",
  saveUninitialized:false, 
  resave:false
}))

passport.use(User.createStrategy()); 
//initializing flash
app.use(flash()); 
//initialized passport
app.use(passport.initialize());
app.use(passport.session());



//serialize and deserialize the user information
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 


let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let unidayRouter = require('../routes/uniday');


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/uni-day', unidayRouter)


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
  res.render('error',
  {
    title:"Error"
  }
  );
});

module.exports = app;
