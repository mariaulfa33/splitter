'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return Promise.all([
    queryInterface.addColumn('Transactions', 'status',  {type : Sequelize.BOOLEAN , defaultValue : false}),
    queryInterface.removeColumn('Users', 'balance')
  ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return Promise.all([
    queryInterface.removeColumn('Transactions', 'status'),
    queryInterface.addColumn('Users', 'balance', {type : Sequelize.INTEGER})
  ])
  }
};
