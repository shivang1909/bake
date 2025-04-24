import nodemailer from "nodemailer";
import dotenv from "dotenv";
import InvoicePDF from "./InvoicePDF.js";
import { renderToBuffer } from "@react-pdf/renderer";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});


// mail for order Confirm to USER
export const sendOrderConfirmationEmail = async (customerEmail, order) => {
    try {
        const orderDate = new Date().toLocaleString("en-IN", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });
        const pdfBuffer = await renderToBuffer(InvoicePDF({ order }));

        const productTable = order.products.map(item =>
            item.variantPrices.map(variant => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.itemname || "Unknown"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${variant.weight || "N/A"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${variant.quantity || 0}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">₹${(variant.price || 0) * (variant.quantity || 0)}</td>
                </tr>
            `).join("")
        ).join("");
        const userOrderList = `${process.env.FRONTEND_URL}/dashboard/myorders`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: customerEmail,
            subject: "📦 Order Confirmation - Your Order Has Been Placed!",
            html: `
                <h3>Thank you for your order!</h3>
                <p>Your order <strong>#${order.orderId}</strong> has been placed successfully on ${orderDate}.</p>
                <table style="border-collapse: collapse; width: 100%;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Weight</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>${productTable}</tbody>
                </table>
                <p><strong>Total: ₹${order.finalOrderTotal}</strong></p>
                <p>We will notify you once your order is out for delivery.
                    <a href="${userOrderList}" target="_blank" style="color: blue; text-decoration: underline;">
                        Click here
                    </a>
                </p>
            `,
            attachments: [
                {
                    filename: `Invoice-${order.orderId}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };
        await transporter.sendMail(mailOptions);
        console.log("📧 Order confirmation email sent to:", customerEmail);
    } catch (error) {
        console.error("❌ Error sending order confirmation email:", error.message);
    }
};




export const sendOutForDeliveryEmail = async (customerEmail, order, otp) => {
    try {
        const deliveryDate = new Date().toLocaleString("en-IN", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });

        const productTable = order.products.map(item =>
            item.variantPrices.map(variant => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.itemname || "Unknown"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${variant.weight || "N/A"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${variant.quantity || 0}</td>
                </tr>
            `).join("")
        ).join("");

        const mailOptions = {
            from: process.env.EMAIL,
            to: customerEmail,
            subject: "🚚 Your Order is Out for Delivery! (OTP Inside)",
            html: `
                <h3>Your order is on the way! 🚀</h3>
                <p>Your order <strong>#${order.orderId}</strong> is now out for delivery as of ${deliveryDate}.</p>
                <p>Here’s a summary of your order:</p>
                <table style="border-collapse: collapse; width: 100%;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Weight</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>${productTable}</tbody>
                </table>
                <p><strong>Your OTP for Payment Confirmation: <span style="color: red;">${otp}</span></strong></p>
                <p>Please enter this OTP to confirm your payment before receiving the order.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 OTP email sent to:", customerEmail);
    } catch (error) {
        console.error("❌ Error sending OTP email:", error.message);
    }
};



// mail for order deliverd to USER
export const sendOrderDeliveredEmail = async (customerEmail, order) => {
    try {
        if (!customerEmail) {
            throw new Error("No recipient email provided.");
        }
        if (!order || !order.orderDeliveredDatetime) {
            throw new Error("Order data is invalid or missing orderDeliveredDatetime.");
        }


        await transporter.verify();

        // Format Date
        const deliveryDate = new Date(order.orderDeliveredDatetime).toLocaleString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        // Generate Product Table
        const productTable = Array.isArray(order.products)
            ? order.products.map(product => (
                product.variantPrices?.map(variant => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${product.itemname || "Unknown"}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${variant.weight || "N/A"}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${variant.quantity || 0}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">₹${(variant.price || 0) * (variant.quantity || 0)}</td>
                    </tr>
                `).join("")
            )).join("")
            : "<tr><td colspan='4' style='padding: 10px; text-align: center;'>No products available</td></tr>";

        // Email Template
        const mailOptions = {
            from: process.env.EMAIL,
            to: customerEmail,
            subject: "✅ Your Order Has Been Delivered! 🎉",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h3 style="color: #27ae60;">🎉 Order Delivered Successfully! 🎉</h3>
                    <p>Your order <strong>#${order.orderId || "N/A"}</strong> has been successfully delivered on <strong>${deliveryDate}</strong>.</p>

                    <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 10px;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="border: 1px solid #ddd; padding: 10px;">Product</th>
                                <th style="border: 1px solid #ddd; padding: 10px;">Weight</th>
                                <th style="border: 1px solid #ddd; padding: 10px;">Quantity</th>
                                <th style="border: 1px solid #ddd; padding: 10px;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productTable}
                        </tbody>
                    </table>

                    <p><strong>Total Amount Paid:</strong> ₹${order.finalOrderTotal || "0.00"}</p>

                    <p>Thank you for shopping with us! 😊<br>If you have any questions, feel free to contact us.</p>

                    <p>Best Regards,<br><strong>Your Store Team</strong></p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Order delivered email sent to:", customerEmail);
    } catch (error) {
        console.error("❌ Error sending order delivered email:", error.message);
    }
};


// Mail for new order placed to ADMIN
export const sendNewOrderNotificationEmail = async (adminEmail, order) => {
    try {
        console.log("📧 Sending new order notification email to Admin:", adminEmail);
        
        const orderDate = new Date().toLocaleString("en-IN", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });

        const adminDashboardLink = `${process.env.FRONTEND_URL}/admin/dashboard/order-list`;

        // Generate product details in table format
        const productTable = `
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Weight</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.products.map(item => 
                        item.variantPrices.map(variant => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">${item.itemname || "Unknown"}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${variant.weight || "N/A"}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${variant.quantity || 0}</td>
                            </tr>
                        `).join("")
                    ).join("")}
                </tbody>
            </table>
        `;

        const mailOptions = {
            from: process.env.EMAIL,
            to: adminEmail,
            subject: "🛒 New Order Received - #" + order.orderId,
            html: `
                <h3 style="color: #333;">New Order Received</h3>
                <p>Order ID: <strong>${order.orderId}</strong></p>
                <p>Placed on: ${orderDate}</p>
                <p><strong>Products:</strong></p>
                ${productTable}
                <p><strong>Total Amount: ₹${order.finalOrderTotal}</strong></p>
                <p>Check the admin dashboard for more details: 
                    <a href="${adminDashboardLink}" target="_blank" style="color: blue; text-decoration: underline;">
                        Click here
                    </a>
                </p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 New order notification email sent to Admin:", adminEmail);
    } catch (error) {
        console.error("❌ Error sending admin order notification email:", error.message);
    }
};

export const sendOrderCancellationEmailToAdmin = async (adminEmail, order) => {
    try {
        const orderDate = new Date().toLocaleString("en-IN", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });

        const adminDashboardLink = `${process.env.FRONTEND_URL}/admin/dashboard/order-list`;

        const productTable = `
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th>Product Name</th>
                        <th>Weight</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.products.map(item =>
                        item.variantPrices.map(variant => `
                            <tr>
                                <td>${item.itemname || "Unknown"}</td>
                                <td>${variant.weight || "N/A"}</td>
                                <td>${variant.quantity || 0}</td>
                            </tr>
                        `).join("")
                    ).join("")}
                </tbody>
            </table>
        `;

        const mailOptions = {
            from: process.env.EMAIL,
            to: adminEmail,
            subject: `❌ Order Cancelled - #${order.orderId}`,
            html: `
                <h3 style="color: #c0392b;">Order Cancelled</h3>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Cancelled on:</strong> ${orderDate}</p>
                ${productTable}
                <p><strong>Total Amount:</strong> ₹${order.finalOrderTotal}</p>
                <p>View details: <a href="${adminDashboardLink}" target="_blank">Admin Dashboard</a></p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Order cancellation email sent to Admin:", adminEmail);
    } catch (error) {
        console.error("❌ Error sending cancellation email to admin:", error.message);
    }
};

export const sendOrderCancellationEmailToUser = async (customerEmail, order) => {
    try {
        const orderDate = new Date(order.createdAt).toLocaleString("en-IN", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });

        const userOrderList = `${process.env.FRONTEND_URL}/dashboard/myorders`;

        // const productTable = order.products.map(item =>
        //     item.variantPrices.map(variant => `
        //         <tr>
        //             <td>${item.itemname || "Unknown"}</td>
        //             <td>${variant.weight || "N/A"}</td>
        //             <td>${variant.quantity || 0}</td>
        //         </tr>
        //     `).join("")
        // ).join("");

        const productTable = `
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Weight</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${order.products.map(item => 
                    item.variantPrices.map(variant => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.itemname || "Unknown"}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${variant.weight || "N/A"}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${variant.quantity || 0}</td>
                        </tr>
                    `).join("")
                ).join("")}
            </tbody>
        </table>
    `;
        const mailOptions = {
            from: process.env.EMAIL,
            to: customerEmail,
            subject: `✅ Your Order #${order.orderId} has been Cancelled`,
            html: `
                <h3>Your order has been cancelled</h3>
                <p>You have successfully cancelled order <strong>#${order.orderId}</strong> placed on ${orderDate}.</p>
                <p>Below are the order details:</p>
                ${productTable}
                <p><strong>Total: ₹${order.finalOrderTotal}</strong></p>
                <p>You can view your order history here: 
                    <a href="${userOrderList}" target="_blank" style="color: blue;">My Orders</a>
                </p>
                <p>If you have any questions or made a mistake, feel free to contact our support.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Order cancellation email (user-initiated) sent to:", customerEmail);
    } catch (error) {
        console.error("❌ Error sending user-initiated cancellation email:", error.message);
    }
};


export const sendOrderCancellationEmailToDeliveryPartner = async (partnerEmail, order) => {
    try {
        const orderDate = new Date().toLocaleString("en-IN", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });

        const deliveryPanelLink = `${process.env.FRONTEND_URL}/delivery/dashboard/assigned-orders`;

        const productTable = `
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Weight</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${order.products.map(item => 
                    item.variantPrices.map(variant => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.itemname || "Unknown"}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${variant.weight || "N/A"}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${variant.quantity || 0}</td>
                        </tr>
                    `).join("")
                ).join("")}
            </tbody>
        </table>
    `;
        const mailOptions = {
            from: process.env.EMAIL,
            to: partnerEmail,
            subject: `❌ Assigned Order Cancelled - #${order.orderId}`,
            html: `
                <h3>Heads Up!</h3>
                <p>The following assigned order has been cancelled:</p>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Cancelled on:</strong> ${orderDate}</p>
                ${productTable}
                <p>Check your dashboard for updated assignments: 
                    <a href="${deliveryPanelLink}" target="_blank">Assigned Orders</a>
                </p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Order cancellation email sent to Delivery Partner:", partnerEmail);
    } catch (error) {
        console.error("❌ Error sending cancellation email to delivery partner:", error.message);
    }
};
export  const sendResetOTP =  async (email,otp)=>{
    try {
       

        console.log("📧 Sending reassignment email to:", email);

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Format the email body to include all reassigned order IDs
         

        let mailOptions = {
            from: `"Bake Flavour Support" <${process.env.EMAIL}>`,
            to: email,  
            subject: "🔐 Password Reset OTP - Bake Flavour",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #d9534f;">Password Reset Request</h2>
                    <p>We received a request to reset your password for your Bake Flavour account.</p>
                    <p>Please use the following One-Time Password (OTP) to proceed:</p>

                    <div style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px; width: fit-content; border-radius: 5px;">
                        ${otp}
                    </div>

                    <p>This OTP is valid for the next 10 minutes. If you didn’t request a password reset, please ignore this email.</p>
                    <br>
                    <p>Regards,<br><strong>Bake Flavour Team</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    
    } catch (error) {
        console.error("❌ Error sending reassignment email:", error);
    }
}

export async function sendOrderReassignedEmail(email, orders) {
    try {
        if (!email || !orders || orders.length === 0) {
            console.log("❌ No valid email or orders to send reassignment notification.");
            return;
        }

        console.log("📧 Sending reassignment email to:", email);

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Format the email body to include all reassigned order IDs
        let orderDetails = orders.map(order => `<li><strong>Order ID:</strong> ${order.orderId}</li>`).join("");

        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `🚚 Order Reassignment Notification (${orders.length} Order${orders.length > 1 ? "s" : ""})`,
            html: `
                <p>Hello,</p>
                <p>We regret to inform you that the following order(s) have been reassigned to another delivery partner:</p>
                <ul>${orderDetails}</ul>
                <p>Thank you for your service!</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Reassignment email sent successfully to ${email} for ${orders.length} order(s).`);
    } catch (error) {
        console.error("❌ Error sending reassignment email:", error);
    }
}



// import nodemailer from "nodemailer";

export async function sendOrderAssignedEmail(email, order) {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        console.log("Order Data",order);
        

        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "New Delivery Assigned 🚚",
            html:`
            <p>Hello,</p>
            <p>A new order has been assigned to you. Please find the details below:</p>
            <h3>Order Details:</h3>
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th>Order ID</th>
                    <td>${order.orderId}</td>
                </tr>
                <tr>
                    <th>Payment Status</th>
                    <td>${order.payment_status}</td>
                </tr>
                <tr>
                    <th>COD Status</th>
                    <td>${order.cod_status}</td>
                </tr>
                <tr>
                    <th>Final Total</th>
                    <td>₹${order.finalOrderTotal}</td>
                </tr>
            </table>

            <h3>Delivery Address:</h3>
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th>Address Line</th>
                    <td>${order.delivery_address.address_line}</td>
                </tr>
                <tr>
                    <th>City</th>
                    <td>${order.delivery_address.city}</td>
                </tr>
                <tr>
                    <th>State</th>
                    <td>${order.delivery_address.state}</td>
                </tr>
                <tr>
                    <th>Pincode</th>
                    <td>${order.delivery_address.pincode}</td>
                </tr>
                <tr>
                    <th>Country</th>
                    <td>${order.delivery_address.country}</td>
                </tr>
                <tr>
                    <th>Mobile</th>
                    <td>${order.delivery_address.mobile}</td>
                </tr>
            </table>

            <p>Please check your dashboard for more details.</p>
            <p>Thank you!</p>
        `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Order assignment email sent to:", email);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}



export async function sendBulkOrderAssignedEmail(email, orders) {
    try {
        console.log("📧 Sending bulk assignment email to:", email);
        console.log("📝 Orders received for email:", JSON.stringify(orders, null, 2));

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        let orderTableRows = orders.map((order, index) => {
            if (!order.delivery_address) {
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${order.orderId}</td>
                        <td>${order.payment_status || "N/A"}</td>
                        <td>₹${order.finalOrderTotal || "N/A"}</td>
                        <td colspan="6" style="color: red;">⚠️ Missing delivery address</td>
                    </tr>
                `;
            }
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${order.orderId}</td>
                    <td>${order.payment_status || "N/A"}</td>
                    <td>₹${order.finalOrderTotal || "N/A"}</td>
                    <td>${order.delivery_address.address_line || "N/A"}</td>
                    <td>${order.delivery_address.city || "N/A"}</td>
                    <td>${order.delivery_address.state || "N/A"}</td>
                    <td>${order.delivery_address.pincode || "N/A"}</td>
                    <td>${order.delivery_address.country || "N/A"}</td>
                    <td>${order.delivery_address.mobile || "N/A"}</td>
                </tr>
            `;
        }).join('');

        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "🚚 Multiple Orders Assigned to You",
            html: `
                <p>Hello,</p>
                <p>The following orders have been assigned to you:</p>
                <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
                    <tr>
                        <th>Sr. No.</th>
                        <th>Order ID</th>
                        <th>Payment Status</th>
                        <th>Final Total</th>
                        <th>Address Line</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Pincode</th>
                        <th>Country</th>
                        <th>Mobile</th>
                    </tr>
                    ${orderTableRows}
                </table>
                <p>Please check your dashboard for more details.</p>
                <p>Thank you!</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Bulk order assignment email sent successfully to:", email);
    } catch (error) {
        console.error("❌ Error sending bulk assignment email:", error);
    }
}
