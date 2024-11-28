'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('drivers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ratePerKm: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      minKm: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      photoProfile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      photoCar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      registeredSince: { 
        type: Sequelize.INTEGER, 
        allowNull: true, 
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('drivers');
  }
};
