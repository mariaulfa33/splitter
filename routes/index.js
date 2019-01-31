const router = require('express').Router()
const userRoute = require('./User/index')
const privateRoute = require('./private/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Model = require('../models')
router.get('/', function(req, res) {
  res.render('home', {session : null})
})

//paling banyak ngutangin
router.get('/dermawan', function(req, res) {
  Model.Transaction.findAll({
    attributes : ['UserId', [Sequelize.fn('SUM', Sequelize.col('price')), 'totalBills']],
    group : ['UserId'],
    order : [[Sequelize.fn('SUM', Sequelize.col('price')), 'DESC']],
    limit : 5
  })
  .then(data => {
    let newData = data.map(user => {
      return new Promise((resolve, reject) => {
        user.getUser()
        .then(dataUser => {
          user.dataValues.username = dataUser.dataValues.username
          resolve(user)
        })
        .catch(err => {
          reject(err)
        })
      })
    })
    return Promise.all(newData)
  })
  .then(data => {
    let label = []
    let total = []
    data.forEach(user => {
      label.push(user.dataValues.username)
      total.push(user.dataValues.totalBills)
    })
    res.render('chart', {label, total, predikat : 'TERBAIK', comment : 'NGUTANGIN', session : null})
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/utangers', function(req, res) {
  Model.UserTransaction.findAll({
    attributes : ['UserId',[Sequelize.fn('SUM', Sequelize.col('bill')), 'totalBills']],
    where: {
      $or: [
          {
              status: 
              {
                  $eq: "pending"
              }
          }, 
          {
              status: 
              {
                  $eq: "active"
              }
          }
      ]
  },
    group : ['UserId'],
    order : [[Sequelize.fn('SUM', Sequelize.col('bill')), 'DESC']],
    limit : 5
  })
  .then(data => {
    console.log(data)
    let newData = data.map(user => {
      return new Promise((resolve, reject) => {
        user.getUser()
        .then(dataUser => {
          user.dataValues.username = dataUser.dataValues.username
          resolve(user)
        })
        .catch(err => {
          reject(err)
        })
      })
    })
    return Promise.all(newData)
  })
  .then(data => {
    let label = []
    let total = []
    data.forEach(user => {
      label.push(user.dataValues.username)
      total.push(user.dataValues.totalBills)
    })
    res.render('chart', {label, total, predikat : 'BELUM BAYAR', comment : 'BANYAK UTANG', session : null})
  })
  .catch(err => {
    res.send(err)
  })
})
router.use('/users', userRoute)
router.use('/', privateRoute)
module.exports = router