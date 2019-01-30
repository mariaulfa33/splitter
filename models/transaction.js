'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    deadline: DataTypes.DATE,
    UserId: DataTypes.INTEGER
  }, {
    hooks : {
      afterCreate (transaction) {
        return new Promise((resolve, reject) => {
          sequelize.models.User.findByPk(transaction.UserId)
          .then(user => {
            return sequelize.models.User.update({
              balance : (user.dataValues.balance - transaction.dataValues.price)
            }, {
              where : {
                id : user.dataValues.id
              }
            })
          })
          .then(() => {
            return sequelize.models.UserTransaction.create({
              UserId : transaction.dataValues.UserId,
              TransactionId : transaction.dataValues.id,
              bill : transaction.dataValues.price,
              status : 'paid'
            })
          })
          .then(() => {
            resolve()
          })
          .catch(err => {
            reject(err)
          })
        })
      }
    }
  });
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.User)
    Transaction.hasMany(models.UserTransaction)
    Transaction.belongsToMany(models.User,{through : models.UserTransaction})
    // Transaction.hasMany(models.UserTransaction)
  
  };
  return Transaction;
};