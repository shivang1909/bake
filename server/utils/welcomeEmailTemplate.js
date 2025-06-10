const welcomeEmailTemplate = ({ name }) => {  
    const logoUrl = `${process.env.FRONTEND_URL}/images/BakeFlavors.png`;
    return `
    <div style="font-family: Arial, sans-serif; padding: 30px; text-align: center; background-color: #f9f9f9;">
        <img src="${logoUrl}" alt="Bake Flavours Logo" style="width: 120px; margin-bottom: 20px;" />


        <h2 style="color: #333;">Welcome to <span style="color: #d32f2f;">Bake Flavours</span>, ${name}!</h2>
        <p style="font-size: 16px; color: #555;">
            Thank you for joining Bake Flavours with Google! Your account is already verified and ready to use.
            Start exploring delicious recipes and connect with our baking community.
        </p>


        <a href="${process.env.FRONTEND_URL}" style="display: inline-block; margin-top: 25px; background-color: #d32f2f; color: #fff; padding: 14px 24px; text-decoration: none; font-size: 16px; border-radius: 5px;">
            Start Baking Now
        </a>


        <p style="margin-top: 25px; font-size: 16px; color: #555;">
            Here's what you can do next:
        </p>
        <ul style="text-align: left; max-width: 400px; margin: 20px auto; padding-left: 20px; color: #555;">
            <li style="margin-bottom: 10px;">Browse our recipe collection</li>
            <li style="margin-bottom: 10px;">Save your favorite recipes</li>
            <li style="margin-bottom: 10px;">Connect with other bakers</li>
            <li>Share your own creations</li>
        </ul>


        <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />


        <p style="font-size: 13px; color: #999;">
            If you have any questions, reply to this email or contact us at
            <a href="mailto:support@bakeflavours.com" style="color: #d32f2f; text-decoration: none;">support@bakeflavours.com</a>
        </p>
    </div>
    `;
};


export default welcomeEmailTemplate;