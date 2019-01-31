'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserTransaction = sequelize.define('UserTransaction', {
    id : {
      type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
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

  UserTransaction.prototype.getStatus = function(status) {
    if(status == 'active') {
      return 'permintaan tagihan diterima'
    } else if(status == 'pending') {
      return 'menunggu konfrimasi'
    } else if(status == 'deleted') {
      return 'permintaan tagihan ditolak'
    } else if(status == 'paid') {
      return 'sudah terbayar'
    } else if(status == 'confirmed') {
      return 'selesai'
    }
  }
  return UserTransaction;
};