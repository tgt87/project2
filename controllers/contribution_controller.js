const Contribution = require('../models/contribution')
const User = require('../models/user')

var contributionController = {
  list: function(req, res){
    Contribution.find({status: 'available'}, function(err, output){
      if(err) throw err
      res.render('contributions/index', {contributions: output})
    })
  },
  show: function(req, res){
    Contribution.findById(req.params.id, function(err, output){
      if(err) throw err
      res.render('contributions/show', {contribution: output})
    })
  },
  // new: function(req, res){
  //   res.render('contributions/new')
  // },
  // create: function(req, res){
  //   Contribution.create(req.body, function(err, output){
  //     if(err) throw err
  //     res.redirect('/contributions')
  //   })
  // }
}


module.exports = contributionController
