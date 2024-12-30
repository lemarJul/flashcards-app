const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  // ConfirmationToken model
  const ConfirmationToken = sequelize.define("ConfirmationToken", {
    token: {
      type: DataTypes.STRING,
      primaryKey: true, // Use token as primary key
      allowNull: false,
      defaultValue: crypto.randomBytes(32).toString("hex"), // Generate a random token by default
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(Date.now() + 3600 * 1000), // Token expires in 1 hour
    },
  });

  ConfirmationToken.associate = function associate() {
    const { User } = sequelize.models;
    ConfirmationToken.belongsTo(User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    });

    return ConfirmationToken;
  };

  return ConfirmationToken;
};
