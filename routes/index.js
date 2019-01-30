const router = require('express').Router()
const userRoute = require('./User/index')
const privateRoute = require('./private/index')
router.get('/', function(req, res) {
  res.render('home')
})
router.use('/users', userRoute)
router.use('/', privateRoute)
module.exports = router