'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserTransaction = sequelize.define('UserTransaction', {
    UserId: DataTypes.INTEGER,
    TransactionId: DataTypes.INTEGER,
    bill: DataTypes.INTEGER,
    status: {
      type:   DataTypes.ENUM,
      values: ['active', 'pending', 'deleted', 'paid']
    }
  }, {});
  UserTransaction.associate = function(models) {
    // associations can be defined here
    UserTransaction.belongsTo(models.Transaction)
    UserTransaction.belongsTo(models.User)
   
  };
  return UserTransaction;
};