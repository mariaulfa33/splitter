const router = require('express').Router()
const Model = require('../../models')
const getStatus = require('../../helpers/getAction')
const middleware = require('../../helpers/middleware.js')
const botSendMessage = require('../../helpers/telegram/telegramBot.js').botSendMessage;
const changeToCurrency = require('../../helpers/changeToCurrency.js')

router.get('/:username', middleware, function (req, res) {
  let action = req.query.action || null
  Model.User.findOne({
    where : {
      username : req.params.username
    }
  })
  .then(user => {
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
  console.log(req.body, '13845713rahfdsclas')
  Model.User.update({
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    email : req.body.email,
    username : req.body.username,
    chatId : req.body.chatId
  }, {
    where : {
      username : req.params.username
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
  let transId = null
  Model.Transaction.create({
    name : req.body.name,
    price : req.body.price,
    deadline : req.body.deadline,
    UserId : Number(req.session.user.id) //pake session
  })

  .then(transaction => {
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
    // console.log(err)
    res.send(err)
  })
})

router.get('/:username/utang', middleware,function(req, res) {
  Model.Transaction.findAll({
    where : {
      UserId : req.session.user.id
    }
  })
  .then(data => {
    res.render('list-piutang.ejs', {data, username: req.session.user.username})
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/:username/piutang', middleware,function(req, res) {
  Model.UserTransaction.findAll({
    where : {
      UserId : req.session.user.id
    }, include : [{model : Model.Transaction}]
  })
  .then(data => {
    res.render('list-utang.ejs', {data, username: req.session.user.username})
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/:username/:idTrans/utang', middleware,function(req, res) {
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
    // res.send(newData)
    res.render('list-teman-utang', {
      data : newData, getStatus, 
      id: req.session.user.id, 
      username : req.session.user.username,
      transId : req.params.idTrans
    })
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/:username/:transId/aktif', function(req, res) {
  Model.UserTransaction.update({
    status : 'active'
  }, {
    where : {
      id : Number(req.params.transId)
    }
  })
  .then(() => {
    res.redirect(`/${req.session.user.username}/piutang`)
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/:username/:transId/bayar', function(req, res) {
  Model.UserTransaction.update({
    status : 'paid'
  }, {
    where : {
      id : Number(req.params.transId)
    }
  })
  .then(() => {
    res.redirect(`/${req.session.user.username}/piutang`)
  })
  .catch(err => {
    res.send(err)
  })
})


router.get('/:username/logout', function(req,res) {
  req.session.destroy()
  res.redirect('/users/login')
})


router.get('/:username/delete',middleware ,function(req, res) {
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

router.get('/:username/:transId/reminder/:temanId', (req,res) => {
  let dataUser = undefined;
  let dataTransaction = undefined;
  Model.User.findByPk(req.params.temanId)
  .then( dataUserFromFind => {
    dataUser = dataUserFromFind;
    return Model.Transaction.findByPk(req.params.transId)
  })
  .then ( dataTransactionFromFind => { 
    dataTransaction = dataTransactionFromFind;
    return Model.UserTransaction.findOne({
      where : {
        UserId : dataUser.id,
        TransactionId : dataTransaction.id
      }
    })
  })
  .then (data => {
    let currencyFormat = changeToCurrency(data.bill);
    botSendMessage(dataUser.chatId, `${req.params.username} meminta anda untuk membayar hutang anda pada transaksi ${dataTransaction.dataValues.name} sebesar ${currencyFormat}`);
    res.redirect(`/${req.params.username}/${req.params.transId}/utang`)
  })
    // console.log('=======>>>', data.dataValues)
  .catch( err => {
    res.send(`error ${err}`)
  })
})

router.get('/:username/konfirmasi/:transId', function(req, res) {
  Model.UserTransaction.update({
    status : 'delete'
  }, {
    where : {
      id : Number(req.params.transId)
    }, individualHooks : true
  })
  .then(() => {
    return Model.UserTransaction.findByPk(Number(req.params.transId))
  })
  .then((data) => {
    return Model.Transaction.checkAll(Number(data.dataValues.TransactionId))
  })
  .then(() => {
    res.redirect(`/${req.session.user.username}`)
  })
  .catch(err => {
    res.send(err)
    console.log(err)
  })
})



module.exports = router