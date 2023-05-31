const {DataTypes} = require("sequelize");

const User = (sequelize) => {
  sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_profile_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ban: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    creation_date: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date(),
    },
    last_connection: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date(),
    },
  });
};

module.exports = User;
