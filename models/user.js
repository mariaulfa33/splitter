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
    balance: DataTypes.INTEGER
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
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Transaction,{through : 'UserTransaction'})
    User.hasMany(models.UserTransaction)
  };
  return User;
};