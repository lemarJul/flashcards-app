module.exports = (sequelize, DatatTypes) => {
  return sequelize.define(
    "flashcard",
    {
      id: {
        type: DatatTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question: {
        type: DatatTypes.STRING,
        allowNull: false,
        unique: {
          msg: "This question already exists",
        },
        validate: {
          notEmpty: {
            msg: "Please enter a question",
          },
          len: {
            args: [0, 100],
            msg: "Too long. Please enter a question between 0 and 100 characters",
          },
        },
      },
      answer: {
        type: DatatTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter an answer",
          },
          len: {
            args: [0, 100],
            msg: "Too long. Please enter a response between 0 and 100 characters",
          },
        },
      },
      category: {
        type: DatatTypes.STRING,
        allowNull: true,
        get() {
          return this.getDataValue("category")?.split(",") ;
        },
        set(category) {
          this.setDataValue("category", category.join());
        },
      },
    },
    {
      timestamps: true,
      updatedAt: false,
    }
  );
};
