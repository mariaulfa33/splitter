'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    deadline: DataTypes.DATE,
    UserId: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsToMany(models.User,{through : 'UserTransaction'})
    Transaction.hasMany(models.UserTransaction)
  };
  return Transaction;
};