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

async function sendConfirmationEmail({ username, email, confirmationToken }) {
  const baseUrl = process.env.BASE_URL;

  sendAsAdmin({
    to: process.env.EMAIL_TEST || email,
    subject: `Email Confirmation - ${process.env.APP_NAME}`,
    html: `
        <h1>Hello ${username}</h1>
        <h2>Thank you for subscribing to ${process.env.APP_NAME} !</h2>. 
        <p>Please confirm your email by clicking on the following <a href="${baseUrl}/confirm-email?token=${confirmationToken}">link</a>.</p>
        <p>If your link has expired, please <a href="${baseUrl}/signup" >register</a> again.</p>
        <p>See you soon!</p>
        <p> - The ${process.env.APP_NAME} Team -</p>`,
  });
}

module.exports = { sendAsAdmin, sendConfirmationEmail };
