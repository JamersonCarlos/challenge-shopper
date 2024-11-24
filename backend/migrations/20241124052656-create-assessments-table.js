"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("assessments", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      driverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "drivers", // Nome da tabela relacionada
          key: "id", // Chave primária da tabela relacionada
        },
        onDelete: "CASCADE", // Como lidar com a exclusão de um driver
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("assessments");
  },
};
