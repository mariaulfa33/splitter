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
  return Transaction;
};