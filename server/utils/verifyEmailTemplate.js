const verifyEmailTemplate = ({ name, url }) => {  
    const logoUrl = `${process.env.FRONTEND_URL}/images/BakeFlavors.png`;
  return `
  <div style="font-family: Arial, sans-serif; padding: 30px; text-align: center; background-color: #f9f9f9;">
    <img src="${logoUrl}" alt="Bake Flavours Logo" style="width: 120px; margin-bottom: 20px;" />


    <h2 style="color: #333;">Welcome to <span style="color: #d32f2f;">Bake Flavours</span>, ${name}!</h2>
    <p style="font-size: 16px; color: #555;">
      You've successfully created an account. Please verify your email address to activate your account and enjoy our services.
    </p>


    <a href="${url}" style="display: inline-block; margin-top: 25px; background-color: #d32f2f; color: #fff; padding: 14px 24px; text-decoration: none; font-size: 16px; border-radius: 5px;">
      Verify Email
    </a>


    <p style="margin-top: 40px; font-size: 14px; color: #999;">
      If you did not request this registration, you can safely ignore this email.
    </p>


    <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />


    <p style="font-size: 13px; color: #999;">
      If you have any questions, reply to this email or contact us at
      <a href="mailto:support@bakeflavours.com" style="color: #d32f2f; text-decoration: none;">support@bakeflavours.com</a>
    </p>
  </div>
  `;
};


export default verifyEmailTemplate;
