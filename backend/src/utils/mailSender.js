const nodemailer=require("nodemailer");
const { verificationEmailTemplate } = require("./emailTemplate");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "shikhakumari7698@gmail.com",
    pass: "gfvz yeng chpm hddt",
  },
});

async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: `"Talkify Support" <shikhakumari7698@gmail.com>`,
    to: email,
    subject: "Talkify Verification Code",
    text: `Your verification code is: ${code}`,
    html: verificationEmailTemplate(code), // use template here
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

module.exports = {sendVerificationEmail};