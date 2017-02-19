const express = require('express')
const router = express.Router()
var passport = require('passport')

router.get('/signup', function(req, res){
  res.render('auth/signup', {
    flash: req.flash('flash')[0]
  })
})

router.post('/signup', function(req, res) {
  var signupStrategy = passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  })
  return signupStrategy(req, res)
})

router.get('/login', function(req, res){
  res.render('auth/login', {
    flash: req.flash('flash')[0]
  })
})

router.post('/login', function(req, res) {
  var loginStrategy = passport.authenticate('local-login', {
    successRedirect: '/user',
    failureRedirect: '/login',
    failureFlash: true
  })
  return loginStrategy(req, res)
})

router.get('/logout', (req, res) => {
  req.logout() //remove the session => req.user = undefined, req.isAuthenticated()=false
  res.redirect('/')
})

module.exports = router
