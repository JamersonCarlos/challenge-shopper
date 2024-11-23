"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Drivers", [
      {
        name: "Homer Simpson",
        description:
          "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
        car: "Plymouth Valiant 1973 rosa e enferrujado",
        ratePerKm: 2.5,
        minKm: 1,
      },
      {
        name: "Dominic Toretto",
        description:
          "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
        car: "Dodge Charger R/T 1970 modificado",
        ratePerKm: 5.0,
        minKm: 5,
      },
      {
        name: "James Bond",
        description:
          "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
        car: "Aston Martin DB5 clássico",
        ratePerKm: 10,
        minKm: 10,
      },
    ]);
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
