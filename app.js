require('dotenv').config({silent: true})
var express = require('express')
var path = require('path')
var debug = require('debug')
var logger = require('morgan')
var bodyParser = require('body-parser')
var expressLayouts = require('express-ejs-layouts')
var app = express()
var router = express.Router()
var methodOverride = require('method-override')
var passport = require('passport')

// all you need for flash data
var session = require('express-session')
var flash = require('connect-flash')
var cookieParser = require('cookie-parser')
var MongoStore = require('connect-mongo')(session) //connect-mongo need session

var mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)
mongoose.Promise = global.Promise

app.use(express.static('public'))

app.use(cookieParser(process.env.SESSION_SECRET))
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
  })
}))
// initialize passport into your application
app.use(passport.initialize())
app.use(passport.session())
require('./config/passportConfig')(passport)
app.use(flash())

app.use(methodOverride('_method'))
app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
// app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts)
// app.engine('ejs', require('ejs').renderFile)
app.set('view engine', 'ejs')

// routes to login & signup
app.use(function(req, res, next){
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

const Auth = require('./routes/authRoutes')
app.use('/', Auth)

//
// app.get('/test', function(req, res){
//   res.send('secret is ' + process.env.SESSION_SECRET)
// })

// const Contribution = require('./models/contribution')
// Contribution.find({}, function(err, output){
//   if(err) console.error(err)
//   console.log(output)
// })

app.get('/', function (req, res) {
//   req.flash('flash', {
//     type: 'success',
//     message: 'Welcome to animal shelter'
//   }) // setting the flash data
  res.render('homepage')
 })
// // blocks those who are not logged in
function isNotLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next()
  req.flash('flash', {
    type: 'danger',
    message: 'Restricted Page: Pls login'
  })
  return res.redirect('/login')
}
// // blocks those who are logged in
function isLoggedIn(req, res, next){
  if(req.isAuthenticated() === false) return next()
  req.flash('flash', {
    type: 'danger',
    message: 'You have login before'
  })
}

//app.use(isNotLoggedIn)
const contributions = require('./routes/contribution_router')
app.use('/contributions', contributions)

const users = require('./routes/user_router')
app.use('/user', users)
//
//
// app.get('/animals', isNotLoggedIn, function (req, res) {
//   Animal.find({}, function (err, output) {
//     res.render('animals/index', {
//       animals: output,
//       flash: req.flash('flash')[0]
//     })
//   })
// })
// app.get('/animals/:id', isNotLoggedIn, function (req, res, next) {
//   if (req.query.status) {
//     return next('route')
//   }
//
//   Animal.findById(req.params.id, function (err, output) {
//     if (err) return next(err)
//     res.render('animals/show', {
//       animal: output
//     })
//   })
// })
// app.get('/animals/:id', isNotLoggedIn, function (req, res, next) {
//   Animal.findByIdAndUpdate(req.params.id, {
//     status: req.query.status
//   }, function (err, output) {
//     if (err) return next(err)
//
//     res.redirect('/animals')
//   })
// })
// app.post('/animals',isNotLoggedIn, function (req, res, next) {
//   Animal.create(req.body.animals, function (err, output) {
//     if (err) {
//       if (err.name === 'ValidationError') {
//         let errMessages = []
//         for (field in err.errors) {
//           errMessages.push(err.errors[field].message)
//         }
//
//         console.log(errMessages)
//
//         req.flash('flash', {
//           type: 'danger',
//           message: errMessages
//         })
//         res.redirect('/animals')
//       }
//
//       return next(err)
//     }
//     req.flash('flash', {
//       type: 'success',
//       message: 'Created an animal with name: ' + output.name
//     })
//     res.redirect('/animals')
//   })
// })
// app.delete('/animals/:id', isNotLoggedIn, function (req, res, next) {
//   Animal.findByIdAndRemove(req.params.id, function (err, output) {
//     if (err) return next(err)
//     req.flash('flash', {
//       type: 'warning',
//       message: 'Deleted an animal'
//     })
//     res.redirect('/animals')
//   })
// })
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function (err, req, res, next) {
//     // res.status(err.status || 500)
//     // res.render('error', {
//     //   message: err.message,
//     //   error: err
//     // })
//   })
// }

const port = process.env.PORT || 5000
app.listen(port, function () {
  console.log('Project2 App is running on ' + port)
})
