"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Fields extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Fields.hasMany(models.Reservations, {
        foreignKey: "id_field",
        as: "reservations",
      });
    }
  }

  Fields.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      direction: DataTypes.STRING,
      photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Fields",
    }
  );

  return Fields;
};
