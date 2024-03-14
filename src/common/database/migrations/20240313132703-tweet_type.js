'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Tweet','tweet_type',{
      type: Sequelize.ENUM('AD','NEWS','TWEET')
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Tweet','tweet_type')
  }
};
