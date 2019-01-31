'use strict';
const bcrypt = require('../helpers/getpass')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: {
      type : DataTypes.STRING,
      validate : {
        len : [1]
      }
    },
    lastname: {
      type : DataTypes.STRING,
      validate : {
        len : [1]
      }
    },
    username: {
      type : DataTypes.STRING,
      validate : {
        len : [1],
        isUnique(value) {
          return new Promise((resolve, reject) => {
            User.findAll({
              where : {
                username : value
              }
            })
            .then(data => {
              if(data.length !== 0 && data[0].dataValues.id != this.id) {
                throw new Error ('username already taken')
              } else {
                resolve()
              }
            })
            .catch(err => {
              reject(err)
            })
          })
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      validate : {
        isEmail : true,
        isUnique(value) {
          return new Promise((resolve, reject) => {
            User.findAll({
              where : {
                email : value
              }
            })
            .then(data => {
              if(data.length !== 0 && data[0].dataValues.id != this.id) {
                throw new Error ('Email already in use!')
              } else {
                resolve()
              }
            })
            .catch(err => {
              reject(err)
            })
          })
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      validate : {
        len : [5]
      }
    },
    birthday: DataTypes.DATE,
    chatId : DataTypes.STRING
  }, {
    hooks : {
      beforeCreate : (value) => {
          return new Promise((resolve, reject) => {
          bcrypt(value.password) 
          .then(data => {
            value.password = data
            resolve()
          })
          .catch(err => {
            reject(err)
          })
        })
      },
      beforeDestroy : (value) => {
        return Promise.all([
          sequelize.models.UserTransaction.destroy({
            where : {
              userId : value.id
            }
          }), 
          sequelize.models.Transaction.destroy({
            where : {
              userId : value.id
            }
          })
        ])
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Transaction,{through : models.UserTransaction})
    User.hasMany(models.UserTransaction)
    User.hasMany(models.Transaction)

  };
  return User;
};