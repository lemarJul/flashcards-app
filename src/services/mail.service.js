const nodemailer = require("nodemailer");
require("dotenv").config();

const adminTransporter = nodemailer.createTransport(
  {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADMIN,
      pass: process.env.EMAIL_PASS,
    },
  },

  {
    from: process.env.EMAIL_ADMIN,
  }
);

async function sendAsAdmin({ to, subject, html }) {
  adminTransporter.sendMail({ to, subject, html }, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

module.exports = { sendAsAdmin };
