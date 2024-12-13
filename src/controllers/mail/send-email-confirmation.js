const nodemailer = require("nodemailer");

module.exports = async function sendConfirmationEmail(req, res, next) {
  let baseUrl = req.protocol + "://" + req.get("host");

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADMIN,
      pass: process.env.EMAIL_PASS, // naturally, replace both with your real credentials or an application-specific password
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_ADMIN,
    to: "contactlemarjul@gmail.com",
    subject: `Email Confirmation - ${process.env.APP_NAME}`,
    html: `
      <h1>Hello ${req.user.username}</h1>
      <h2>Thank you for subscribing to ${process.env.APP_NAME} !</h2>. 
      <p>Please confirm your email by clicking on the following <a href="${baseUrl}/confirm-email?token=${req.user.confirmationToken}">link</a>.</p>
      <p>If your link has expired, please <a href="${baseUrl}/signup" >register</a> again.</p>
      <p>See you soon!</p>
      <p> - The ${process.env.APP_NAME} Team -</p>`,
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
};

// Usage:
// sendConfirmationEmail('user-email@example.com', 'unique-token');
