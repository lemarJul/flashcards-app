const { Op } = require("sequelize");
const { User } = require("../db");
const baseService = require("./base.service")(User);
const mailService = require("./mail.service");

async function deleteNotConfirmed() {
  try {
    return await User.destroy({
      where: {
        [Op.and]: [
          { emailConfirmed: false },
          { confirmationTokenExpires: { [Op.lt]: Date.now() } },
        ],
      },
    });
  } catch (error) {
    error.message = `Error in deleting not confirmed users`;
    throw error;
  }
}



function sendPasswordReset() {}

module.exports = {
  name: User.name,
  create: baseService.create,
  findByName: (name) => baseService.findOne({ name }),
  findOne: baseService.findOne,
  update: baseService.updateById,
  deleteById: baseService.deleteById,
  deleteNotConfirmed,
};
