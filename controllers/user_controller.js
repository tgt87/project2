const Contribution = require('../models/contribution')
const User = require('../models/user')

var userController = {
  list: function(req, res){
    User.find({}, function(err, output){
      if(err) throw err
      res.render('users/index', {users: output})
    })
  }
}


module.exports = userController
