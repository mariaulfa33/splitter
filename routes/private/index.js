const router = require('express').Router()
const Model = require('../../models')

//middleware

router.get('/:username', function(req, res) {
  //namnti bisa pake session aja
  let action = req.query.action || null
  Model.User.findOne({
    where : {
      username : req.params.username
    }
  })
  .then(user => {
    // res.send(user)
    if(user !== null) {
      res.render('user-page', {user, edit : false, action})
    } else {
      res.redirect('/users/login')
    }
   
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/:username/edit', function(req, res) {
  // res.render('')
  Model.User.findOne({
    where : {
      username : req.params.username
    }
  })
  .then(user => {
    // res.send(data)
    if(user !== null) {
      res.render('user-page', {user, edit: true, action:null})
    } else {
      res.redirect('/users/login')
    }
  })
  .catch(err => {
    res.send(err)
  })
})

router.post('/:username/edit', function(req, res) {
  Model.User.update({
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    email : req.body.email,
    username : req.body.username
  })
  .then(() => {
    res.redirect(`/${req.body.username}`)
  })
  .catch(err => {
    res.redirect(`/${req.params.username}/edit?msg=${err.message}`)
  })
})

router.post('/:username/topup', function(req, res) {
  Model.User.findOne({
    where : {
      username : req.params.username
    }
  })
  .then(user => {
    return Model.User.update({
      balance : (user.dataValues.balance + Number(req.body.balance))
    }, {
      where : {
        username : req.params.username
      }
    })
  })
  .then(() => {
    res.redirect('/maria33')
  })
  .catch(err => {
    res.redirect('/maria33?msg='+err.message)
  })
})

router.get('/:username/transaction', function(req, res) {
  Model.User.findAll()
  .then(data => {
    data = data.map(data => data.dataValues.username)
    res.render('transaction', {user : data})
  })
  .catch(err => {
    res.send(err)
  })
  
})




module.exports = router