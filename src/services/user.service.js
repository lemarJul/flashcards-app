const { Op } = require("sequelize");
const { User } = require("../db");
const baseService = require("./base.service")(User);

module.exports = {
  create: baseService.create,
  findByName: baseService.findByName,
  update: baseService.updateById,
  deleteById: baseService.deleteById,
  deleteNotConfirmed,
};

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

function sendEmailConfirmation() {}

function sendPasswordReset() {}
