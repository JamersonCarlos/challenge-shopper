"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [driversData, metadata] = await queryInterface.sequelize.query(
      `SELECT * FROM drivers;`
    );
    if (driversData.length === 0) {
      await queryInterface.bulkInsert("drivers", [
        {
          name: "Homer Simpson",
          description:
            "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
          vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
          ratePerKm: 2.5,
          minKm: 1,
          photoCar:
            "https://static.vecteezy.com/ti/fotos-gratis/p1/11445598-velho-carro-de-passageiros-rosa-enferrujado-foto.jpg",
          photoProfile:
            "https://i.pinimg.com/736x/20/af/45/20af454bc02b9ef32aa40cbd6fa43780.jpg",
          registeredSince: 2000,
        },
        {
          name: "Dominic Toretto",
          description:
            "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
          vehicle: "Dodge Charger R/T 1970 modificado",
          ratePerKm: 5.0,
          minKm: 5,
          photoCar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSHOzgM5jDSvWPL3ouOrVXoGti01bP0DLZAQ&s",
          photoProfile:
            "https://upload.wikimedia.org/wikipedia/en/0/0c/Dominic_Toretto.jpg",
          registeredSince: 2002,
        },
        {
          name: "James Bond",
          description:
            "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
          vehicle: "Aston Martin DB5 clássico",
          ratePerKm: 10,
          minKm: 10,
          photoCar:
            "https://images.classic.com/vehicles/e2a807ec98ee8d85e0a6cbe410fe2f161aebd66e.jpg?auto=format&fit=crop&w=600&h=384",
          photoProfile:
            "https://t.ctcdn.com.br/mh7ZUiLnaSqfFpbLT-hSnl9lR10=/1080x1080/smart/i490875.jpeg",
          registeredSince: 1970,
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
