const nodemailer=require("nodemailer");
const dotenv=require();
 
const transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS,
  }, 
});
function registrationTemplate({ email }) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
      <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 24px;">
        <p>Thank you for registering with us. Your email: <strong>${email}</strong></p>
        <p style="margin-top: 24px;">We’re excited to have you on board.</p>
        <hr style="margin: 32px 0;">
        <p style="font-size: 12px; color: #888;">If you did not register, please ignore this email.</p>
      </div>
    </div>
  `;
}
async function sendRegistrationmail({to,mail}) {
const mailOption ={
    from:process.env.EMAIL_USER,
    to,
    subject:"Welcome to our Store!",
    html:registrationTemplate({email}),
};
await transporter.sendMail(mailOption);
} 
  module.exports={
    sendRegistrationmail,
    registrationTemplate,
  }
    
