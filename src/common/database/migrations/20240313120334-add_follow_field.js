'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'Followers');
    await queryInterface.removeColumn('User', 'Followings');
    await queryInterface.addColumn('User', 'Followers', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
    });
    await queryInterface.addColumn('User', 'Followings', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'Followers');
    await queryInterface.removeColumn('User', 'Followings');
  },
};
