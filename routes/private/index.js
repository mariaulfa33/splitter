const router = require('express').Router()
const Model = require('../../models')
const getStatus = require('../../helpers/getAction')
const middleware = require('../../helpers/middleware.js')

router.get('/:username', middleware, function (req, res) {
  //namnti bisa pake session aja
  console.log(req.session)
  let action = req.query.action || null
  Model.User.findOne({
    where : {
      username : req.params.username
    }
  })
  .then(user => {
    // res.send(user)
    if(user !== null) {
      res.render('user-page', {user, section : null, action})
    } else {
      res.redirect('/users/login')
    }
   
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/:username/edit', middleware,function(req, res) {
  // res.render('')
  Model.User.findOne({
    where : {
      username : req.params.username
    }
  })
  .then(user => {
    if(user !== null) {
      res.render('user-page', {user, section:'edit', action:null})
    } else {
      res.redirect('/users/login')
    }
  })
  .catch(err => {
    res.send(err)
  })
})

router.post('/:username/edit/:id', middleware,function(req, res) {
  Model.User.update({
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    email : req.body.email,
    username : req.body.username
  }, {
    where : {
      username : req.params.id
    }
  })
  .then(() => {
    res.redirect(`/${req.body.username}`)
  })
  .catch(err => {
    res.redirect(`/${req.params.username}/edit?msg=${err.message}`)
  })
})


router.get('/:username/transaction', middleware,function(req, res) {
  Model.User.findAll()
  .then(data => {
    data = data.map(data => data.dataValues.username)
    res.render('user-page', {user : data, section : 'transaction', action : ''})
  })
  .catch(err => {
    res.send(err)
  })
})

router.post('/:username/transaction', middleware,function(req, res) {
  //bikin transaksi
  let transId = null
  Model.Transaction.create({
    name : req.body.name,
    price : req.body.price,
    deadline : req.body.deadline,
    UserId : 1 //pake session
  })

  .then(transaction => {
    // bikin User trasaction ke temen temenya
    transId = transaction.dataValues.id
    let userTransactions = []
    for(let i = 0; i < req.body.teman.length; i++) {
      if(req.body.teman[i] != '' || req.body.harga[i] != '') {
        userTransactions.push(Model.User.findOne({
          where : {
            username : req.body.teman[i]
          }, 
          attributes : ['id']
        })) 
      }
    }
    return Promise.all(userTransactions)
  })
  .then((data) => {
    //ini ngolah data supay dapet id nya
    let userData = []
    for(let i = 0; i < data.length; i++) {
      userData.push({
        UserId : data[i].dataValues.id,
        TransactionId : transId,
        bill : req.body.harga[i],
        status : 'pending'
      })
    }
    return Model.UserTransaction.bulkCreate(userData, {})
  })
  .then(() => {
    //berhasil! tinggal kirim message lewat chat bot
    res.redirect(`/${req.session.username}`)
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/:username/utang', middleware,function(req, res) {
  Model.Transaction.findAll({
    where : {
      UserId : 1
    }
  })
  .then(data => {
   
    res.render('list-utang.ejs', {data})
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/:username/:idTrans/utang', function(req, res) {
  Model.UserTransaction.findAll({
    where : {
      TransactionId : req.params.idTrans
    },include : [{model : Model.User}]
  })
  .then(data => {
   
    let newData = data.map(tran => {
      tran.dataValues.status = tran.getStatus(tran.dataValues.status)
      return tran
    })
    res.render('list-teman-utang', {data : newData, getStatus})
  })
  .catch(err => {
    console.log(err)
    res.send(err)
  })
})


router.get('/:username/delete', function(req, res) {
  Model.User.destroy({
    where : {
      username : req.params.username
    }, individualHooks : true
  })
  .then(() => {
    res.redirect('/')
  })
  .catch(err => {
    res.send(err)
  })

})



module.exports = router