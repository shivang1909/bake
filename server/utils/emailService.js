import nodemailer from "nodemailer";

export const sendOrderDeliveredEmail = async (customerEmail, order) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.verify();

        const mailOptions = {
            from: process.env.EMAIL,
            to: customerEmail,
            subject: "Your Order Has Been Delivered!",
            html: `
                <p>Hello,</p>
                <p>Your order <strong>#${order.orderId}</strong> has been successfully delivered!</p>
                <p>Order Details:</p>
                <ul>
                    <li><strong>Order ID:</strong> ${order.orderId}</li>
                    <li><strong>Total Amount:</strong> ${order.totalAmount} Rs</li>
                    <li><strong>Delivery Date:</strong> ${new Date(order.orderDeliveredDatetime).toLocaleString()}</li>
                </ul>
                <p>Thank you for shopping with us!</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Order delivered email sent to:", customerEmail);
    } catch (error) {
        console.error("❌ Error sending order delivered email:", error);
    }
};
