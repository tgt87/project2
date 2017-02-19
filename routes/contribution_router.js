const express = require('express')
const router = express.Router()
const contributionController = require('../controllers/contribution_controller')

router.get('/', contributionController.list)
router.get('/:id', contributionController.show)
// router.get('/new', contributionController.new)
// router.post('/', contributionController.create)

module.exports = router
