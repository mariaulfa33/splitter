'use strict';
const bcrypt = require('../helpers/getpass')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
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