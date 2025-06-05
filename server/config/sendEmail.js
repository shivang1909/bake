// utils/emailService.js
import transporter from "../utils/emailService.js"; // Ensure your transporter config is in this file


const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bake Flavours" <${process.env.EMAIL}>`,
      to: sendTo,
      subject,
      html,
    });


    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};


export default sendEmail;
