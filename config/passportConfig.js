var LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = function(passport){
  passport.serializeUser(function(user, next){
    next(null, user.id)
  })
  passport.deserializeUser(function(id, next){
    User.findById(id, function(err, user){
      next(err, user)
    })
  })

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, givenpassword, next){
  User.findOne({'local.email': email}, function(err, foundUser){
    if(err) return next(err)
    //if no user is found
    if(!foundUser) {
      return next(err, false, req.flash('flash',{
      type: 'warning',
      message: 'No user found by this email'
    }))
  }
  //if can find by email, check the password
  //if password is not the same with the one in db
if(!foundUser.validPassword(givenpassword)) {
  return next(null, false, req.flash('flash', {
    type: 'danger',
    message: 'Access denied: Password is wrong'
  }))
}
//if password is right then return next with the foundUser
  return next(err, foundUser)
})
}))

  passport.use('local-signup', new LocalStrategy({  // local-signup must be the same as in authRoutes
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, next){
    //find user with email as given from callback
    User.findOne({'local.email': email}, function(err, foundUser){
      //inside callback, if there is a user with email call next() middleware with no error argument + update flash data
      if(foundUser){
        console.log('same user with same email found')
        return next(null, false, req.flash('flash', {
          type: 'warning',
          message: 'This email is alr used'
        }))
      } else {
        //if not found = new User
        //save user to db, password is hashed
        // call next() middleware without error arguments
        let newUser = new User({
          local: {
            email: email,
            password: User.encrypt(password)
          }
        })
        console.log(newUser)
        newUser.save(function(err, output){
        return next(null, output, req.flash('flash', {
          type: 'success',
          message: 'Hello new user ' + newUser.local.email
        }))
        })
      }
    })

  }))
}
