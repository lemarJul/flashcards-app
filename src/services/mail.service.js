const nodemailer = require("nodemailer");

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

async function sendConfirmationEmail({ username, email }, confirmationToken, validationUrl) {
  const { APP_NAME } = process.env;
  const confirmationLink = `${validationUrl}?token=${confirmationToken}`;

  sendAsAdmin({
    to: process.env.EMAIL_TEST || email,
    subject: `Email Confirmation - ${process.env.APP_NAME}`,
    html: `
        <h1>Hello ${username}</h1>
        <h2>Thank you for subscribing to ${APP_NAME} !</h2>. 
        <p>Please confirm your email by clicking on the following <a href="${confirmationLink}">link</a>.</p>
        <p>See you soon!</p>
        <p> - The ${APP_NAME} Team -</p>`,
  });
}

module.exports = { sendAsAdmin, sendConfirmationEmail };
