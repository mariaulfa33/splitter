const router = require('express').Router()
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const Model = require('../../models')


router.get('/register',function(req, res) {
  res.render('register')
})

router.post('/register', function(req, res) {
  Model.User.create({
    firstname: req.body.firstname,
    lastname : req.body.lastname,
    username : req.body.username,
    email : req.body.email,
    password : req.body.password,
    birthday : req.body.birthday,
    chatId : req.body.chatId
  })
  .then(() => {
    res.redirect('/')
  })
  .catch(err => {
    res.redirect('/users/register?msg='+err.message)
  })
})

router.get('/login', function(req, res) {
  res.render('login')
})

router.post('/login', function(req, res) {
  let dataUser = undefined;
  Model.User.findOne({
      where : {
        [Op.or]: [
          {
            email: req.body.unique
          },
          {
            username: req.body.unique
          }
        ]
      }
    })
    .then(data => {
      if(data == undefined) {
        throw new Error('Email tidak terdaftar')
      } else {
        dataUser = data
        return bcrypt.compare(req.body.password, data.password)
      }
    })
    .then(function(pass) {
      if(pass == true) {
        req.session.user = {
          id : dataUser.id,
          username : dataUser.username,
          email : dataUser.email,
          chatId : dataUser.chatId
        }
        res.redirect(`/${dataUser.username}`) //pake sessionnya
      } else {
        throw new Error('password salah')
      }
    })
    .catch(err => {
      res.redirect('/users/login?msg='+err)
    })
})


module.exports = router