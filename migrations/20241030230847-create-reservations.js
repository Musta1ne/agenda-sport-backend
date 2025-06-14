"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reservations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
          isIn: [
            ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
          ],
        },
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      id_field: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Fields",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reservations");
  },
};
