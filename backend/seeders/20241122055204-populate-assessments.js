"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [assessmentsData, metadata] = await queryInterface.sequelize.query(
      `SELECT * FROM assessments;`
    );
    if (assessmentsData.length === 0) {
      await queryInterface.bulkInsert("assessments", [
        {
          rating: 2,
          comment:
            "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuuts.",
          driverId: 1,
        },
        {
          rating: 4,
          comment:
            "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos foi super gente boa. Recomendo!",
          driverId: 2,
        },
        {
          rating: 5,
          comment:
            "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
          driverId: 3,
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
