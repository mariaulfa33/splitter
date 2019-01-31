'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    deadline: DataTypes.DATE,
    UserId: DataTypes.INTEGER,
    status : DataTypes.BOOLEAN
  }, {
    hooks : {}
  });
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.User)
    Transaction.hasMany(models.UserTransaction)
    Transaction.belongsToMany(models.User,{through : models.UserTransaction})
  };

  Transaction.checkAll = function (id) {
    return new Promise ((resolve, reject) => {
      sequelize.models.UserTransaction.findAll({
        where : {
          TransactionId : id
        }
      })
      .then(data => {
        let count = 0
        data.forEach(userTrans => {
          if(userTrans.dataValues.status == 'delete') {
            count++
          }
        })
        if(count == data.length) {
          return Transaction.update({
            status : true
          },{ where : {
            id : id
            }
          })
        } else {
          resolve()
        }
      })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
    })
  }
  return Transaction;
};