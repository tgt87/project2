const bcrypt = require('bcryptjs')
var mongoose = require('mongoose')
var UserSchema = new mongoose.Schema({
  local: {
    // email: String,
    // password: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters']
  },
  contributions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contribution'
  }]
}
})

UserSchema.statics.encrypt = function(password){
  return bcrypt.hashSync(password, 10)
}

UserSchema.methods.validPassword = function(givenpassword){
  return bcrypt.compareSync(givenpassword, this.local.password)
}

var User = mongoose.model('User', UserSchema)

module.exports = User
