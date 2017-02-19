var mongoose = require('mongoose')
var contributionSchema = new mongoose.Schema({
  item: {
    type: String,
    required: [true, 'Please specify your item']
  },
  description: String,
  action: String,
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  address: String,
  contributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [String]
})

var Contribution = mongoose.model('Contribution', contributionSchema)

module.exports = Contribution
