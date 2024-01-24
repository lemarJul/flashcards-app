const { User } = require("../../db");
const { Op } = require("sequelize");

module.exports = (req, res, next) => {
  User.destroy({
    where: { 
      [Op.and]: [
        { emailConfirmed: false }, 
        { confirmationTokenExpires: { [Op.lt]: Date.now() } }
      ] 
    },
  })
  .then((result) => {
    res.redirect("/signup");
  }).catch((err) => {
    next(err)
  });
};
