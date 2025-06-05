import nodemailer from "nodemailer";
import dotenv from "dotenv";
import InvoicePDF from "./InvoicePDF.js";
import { renderToBuffer } from "@react-pdf/renderer";
import UserModel from "../models/user.model.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default transporter;

export const sendOrderConfirmationEmail = async (customerEmail, order) => {
  try {
    const orderDate = new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Fetch user name from DB
    const user = await UserModel.findById(order.userId);
    const userName = user?.name || 'Customer';

    const pdfBuffer = await renderToBuffer(InvoicePDF({ order }));

    // Calculate total items count
    const totalItems = order.products.reduce(
      (total, item) => total + item.variantPrices.reduce((sum, variant) => sum + (variant.quantity || 0), 0),
      0
    );

    // Generate product table with gift notes if present
    const productTable = order.products.map(item =>
      item.variantPrices.map(variant => {
        const quantity = variant.quantity || 0;
        const pricePerUnit = variant.price || 0;
        const discountPercent = variant.discount || 0;

        const discountAmountPerUnit = (pricePerUnit * discountPercent) / 100;
        const finalUnitPrice = pricePerUnit - discountAmountPerUnit;
        const finalPriceTotal = finalUnitPrice * quantity;

        // Process gift notes to display them individually with numbering
        let giftNotesHtml = '';
        if (variant.isGiftWrap && variant.giftNotes?.length > 0) {
          giftNotesHtml = variant.giftNotes
            .map((note, index) => 
              `<div style="margin-top: ${index === 0 ? '6px' : '4px'}; font-size: 14px; color: #2c3e50;">
                <strong>Gift Message ${index + 1}:</strong> "${note}"
              </div>`
            )
            .join('');
        }

        return `
          <tr>
  <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="width: 80px;">
          <div style="width: 80px; height: 80px; background: #f9f9f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #f0f0f0;">
            <img src="https://i.postimg.cc/1Rdfc4qR/image.png" alt="${item.itemname}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          </div>
        </td>
        <td style="vertical-align: top; padding-left: 10px;">
          <div style="font-weight: 600; color: #111; font-size: 15px;">${item.itemname}</div>
          <div style="color: #555; font-size: 13px;">${variant.weight}</div>
          ${giftNotesHtml}
        </td>
        <td style="text-align: right; vertical-align: top; padding-left: 20px; white-space: nowrap;">
          <div style="font-weight: 600; color: #111; font-size: 15px;">₹${finalUnitPrice.toFixed(2)}</div>
          <div style="color: #777; font-size: 13px;">Qty: ${quantity}</div>
        </td>
      </tr>
    </table>
  </td>
</tr>

        `;
      }).join("")
    ).join("");

    const userOrderList = `${process.env.FRONTEND_URL}/dashboard/myorders`;

    // Calculate subtotal (order total minus gift wrap charges)
    const subtotal = order.finalOrderTotal - (order.special_Gift_packing || 0);
    
    // Check if there is a promocode applied
    const hasPromocode = order.promo_code && order.promocodeDiscount;
    let promocodeRows = '';

    if (hasPromocode) {
      promocodeRows = `
        <tr>
          <td style="padding: 10px 0; color: #555; font-size: 14px;">Promo Code (${order.promo_code})</td>
          <td style="padding: 10px 0; text-align: right; color: #27ae60; font-weight: 600;">-₹${order.promocodeDiscount.toFixed(2)}</td>
        </tr>
      `;
    }

    const mailOptions = {
      from: `Bake Flavours <${process.env.EMAIL}>`,
      to: customerEmail,
      subject: `Your Order #${order.orderId} is Confirmed`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .header-image {
                height: 120px !important;
              }
              .two-columns {
                display: block !important;
              }
              .column {
                width: 100% !important;
                display: block !important;
                padding: 0 !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          
          <!-- Pre-header Text -->
          <div style="display: none; max-height: 0; overflow: hidden;">
            Your order #${order.orderId} has been confirmed. We'll notify you when it ships.
          </div>
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header Banner -->
            <div style="background-color: #e67e22; padding: 30px 40px; text-align: center; color: white;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Order Confirmed</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your order, ${userName}!</p>
            </div>
            
            <!-- Order Status -->
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef6e6; border-bottom: 1px solid #f0f0f0; padding: 25px 20px;">
  <tr>
    <!-- ORDER NUMBER -->
    <td style="width: 33.33%; text-align: left;">
      <div style="font-size: 13px; color: #666; margin-bottom: 5px;">ORDER NUMBER</div>
      <div style="font-size: 16px; font-weight: 600; color: #111;">#${order.orderId}</div>
    </td>

    <!-- ORDER DATE -->
    <td style="width: 33.33%; text-align: center;">
      <div style="font-size: 13px; color: #666; margin-bottom: 5px;">ORDER DATE</div>
      <div style="font-size: 16px; font-weight: 600; color: #111;">${orderDate}</div>
    </td>

    <!-- TOTAL -->
    <td style="width: 33.33%; text-align: right;">
      <div style="font-size: 13px; color: #666; margin-bottom: 5px;">TOTAL</div>
      <div style="font-size: 16px; font-weight: 600; color: #e74c3c;">₹${order.finalOrderTotal.toFixed(2)}</div>
    </td>
  </tr>
</table>

            
            <!-- Order Summary -->
            <div style="padding: 30px 40px;">
              <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111;">Order Summary</h2>
              
              <!-- Products List -->
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  ${productTable}
                </tbody>
              </table>
              
              <!-- Order Totals -->
              <div style="margin-top: 30px; background-color: #f9f9f9; border-radius: 8px; padding: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Order Total</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px;">Subtotal (${totalItems} items)</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111;">₹${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px;">Shipping</td>
                    <td style="padding: 8px 0; text-align: right; color: #27ae60; font-weight: 600;">FREE</td>
                  </tr>
                  
                  ${order.special_Gift_packing > 0 ? `
                    <tr>
                      <td style="padding: 8px 0; color: #555; font-size: 14px;">Gift Wrapping</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111;">+₹${order.special_Gift_packing.toFixed(2)}</td>
                    </tr>
                  ` : ''}
                  
                  ${hasPromocode ? promocodeRows : ''}
                  
                  <tr style="border-top: 1px solid #e0e0e0;">
                    <td style="padding: 12px 0 0 0; font-size: 15px; font-weight: 700; color: #111;">Total</td>
                    <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #e74c3c;">₹${order.finalOrderTotal.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <!-- Shipping Information -->
<div style="padding: 0 40px 30px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 30px;">
    <tr>
      <!-- Shipping Address -->
      <td class="column" width="50%" valign="top" style="padding-right: 15px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Shipping Address</h3>
        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; font-size: 14px; line-height: 1.5;">
          <div style="font-weight: 600; margin-bottom: 5px;">${order.delivery_address.name || userName}</div>
          <div>${order.delivery_address.address_line1 || 'N/A'}</div>
          <div>${order.delivery_address.address_line2 || ''}</div>
          <div>${order.delivery_address.city || ''}, ${order.delivery_address.state || ''} ${order.delivery_address.pincode || ''}</div>
          <div style="margin-top: 8px;"><strong>Phone:</strong> ${order.delivery_address.mobile || 'N/A'}</div>
        </div>
      </td>
 </tr>
  <tr>
     <!-- Shipping Info -->
    <td valign="top" width="100%" style="display: inline-block; width: 100%; max-width: 100%;">
      <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Shipping Information</h3>
      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; font-size: 14px;">
        <strong>Order Status</strong><br>
        Your order is being processed and will be delivered soon.<br><br>
        Once your order is out for delivery, you will receive an email with a secure OTP to confirm the delivery.
      </div>
    </td>
    </tr>
  </table>

  <div style="text-align: center; margin-top: 20px;">
    <a href="${userOrderList}" style="display: inline-block; background-color: #e67e22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">View Your Order</a>
  </div>
</div>

            
            <!-- Customer Support -->
            <div style="padding: 25px 40px; background-color: #f9f9f9; border-top: 1px solid #f0f0f0;">
              <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Need Help?</h3>
              <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                If you have any questions about your order, please contact our customer support team at <a href="mailto:support@bakeflavours.com" style="color: #e67e22; text-decoration: none;">support@bakeflavours.com</a> or call us at <a href="tel:180012345678" style="color: #e67e22; text-decoration: none;">1-800-1234-5678</a>.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 40px; background-color: #f1f1f1; text-align: center;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 30px; margin-bottom: 15px;">
              <div style="font-size: 12px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bake Flavours. All rights reserved.</p>
                <p style="margin: 0;">
                  <a href="${process.env.FRONTEND_URL}/privacy" style="color: #777; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                  <a href="${process.env.FRONTEND_URL}/terms" style="color: #777; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                  <a href="${process.env.FRONTEND_URL}/contact" style="color: #777; text-decoration: none; margin: 0 10px;">Contact Us</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Invoice-${order.orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
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
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const customerName = order.delivery_address.name || "Customer";
    const userOrderList = `${process.env.FRONTEND_URL}/dashboard/myorders`;

    const mailOptions = {
      from: `Bake Flavours <${process.env.EMAIL}>`,
      to: customerEmail,
      subject: `🚚 Your Order #${order.orderId} is Out for Delivery`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Out for Delivery</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .header-image {
                height: 120px !important;
              }
              .two-columns {
                display: block !important;
              }
              .column {
                width: 100% !important;
                display: block !important;
                padding: 0 !important;
              }
              .otp-code {
                letter-spacing: 10px !important;
                font-size: 32px !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          
          <!-- Pre-header Text -->
          <div style="display: none; max-height: 0; overflow: hidden;">
            Your order #${order.orderId} is out for delivery. Please use OTP ${otp} to confirm delivery.
          </div>
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header Banner -->
            <div style="background-color: #e67e22; padding: 30px 40px; text-align: center; color: white;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Out for Delivery</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order is on the way, ${customerName}!</p>
            </div>
            
            <!-- Order Status -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef6e6; border-bottom: 1px solid #f0f0f0; padding: 25px 20px;">
              <tr>
                <!-- ORDER NUMBER -->
                <td style="width: 33.33%; text-align: left;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">ORDER NUMBER</div>
                  <div style="font-size: 16px; font-weight: 600; color: #111;">#${order.orderId}</div>
                </td>

               

                <!-- TOTAL -->
                <td style="width: 33.33%; text-align: right;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">ORDER TOTAL</div>
                  <div style="font-size: 16px; font-weight: 600; color: #e74c3c;">₹${order.finalOrderTotal.toFixed(2)}</div>
                </td>
              </tr>
            </table>
            
            <!-- Delivery Content -->
            <div style="padding: 30px 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://i.postimg.cc/DygjwfNk/delivery-back.png" alt="Delivery Truck" style="width: 120px; height: auto; margin-bottom: 20px;">
                <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #111;">Your Order is On the Way!</h2>
                <p style="margin: 0; font-size: 15px; color: #555; line-height: 1.5;">
                  Our delivery partner is bringing your delicious Bake Flavours order to you. 
                  Please keep your phone handy for delivery updates.
                </p>
              </div>
              
              <!-- OTP Box -->
              <div style="background-color: #f9f9f9; border-radius: 8px; padding: 25px; text-align: center; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Delivery OTP</h3>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #555;">
                  Please share this OTP with the delivery agent to confirm receipt:
                </p>
                <div style="background-color: #ffffff; border: 1px dashed #e67e22; border-radius: 6px; padding: 15px; display: inline-block;">
                  <div class="otp-code" style="font-size: 40px; font-weight: 700; letter-spacing: 15px; color: #e74c3c; padding: 0 15px;">${otp}</div>
                </div>
                <p style="margin: 20px 0 0 0; font-size: 13px; color: #777;">
                  (This OTP is valid for delivery confirmation only)
                </p>
              </div>
              
              <!-- Delivery Instructions -->
              <div style="background-color: #f0f7ff; border-left: 4px solid #2980b9; border-radius: 4px; padding: 15px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #111;">Important Delivery Instructions</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #555;">
                  <li style="margin-bottom: 8px;">Please verify the package condition before accepting</li>
                  <li style="margin-bottom: 8px;">Check all items against your order details</li>
                  <li style="margin-bottom: 8px;">Do not share this OTP with anyone except the delivery agent</li>
                  <li>For perishable items, store in a cool place immediately</li>
                </ul>
              </div>
              
              <!-- Track Order Button -->
              <div style="text-align: center; margin-top: 20px;">
                <a href="${userOrderList}" style="display: inline-block; background-color: #e67e22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">Track Your Order</a>
              </div>
            </div>
            
            <!-- Customer Support -->
            <div style="padding: 25px 40px; background-color: #f9f9f9; border-top: 1px solid #f0f0f0;">
              <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Need Help?</h3>
              <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                If you have any questions about your delivery, please contact our customer support team at <a href="mailto:support@bakeflavours.com" style="color: #e67e22; text-decoration: none;">support@bakeflavours.com</a> or call us at <a href="tel:180012345678" style="color: #e67e22; text-decoration: none;">1-800-1234-5678</a>.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 40px; background-color: #f1f1f1; text-align: center;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 30px; margin-bottom: 15px;">
              <div style="font-size: 12px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bake Flavours. All rights reserved.</p>
                <p style="margin: 0;">
                  <a href="${process.env.FRONTEND_URL}/privacy" style="color: #777; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                  <a href="${process.env.FRONTEND_URL}/terms" style="color: #777; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                  <a href="${process.env.FRONTEND_URL}/contact" style="color: #777; text-decoration: none; margin: 0 10px;">Contact Us</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 OTP email sent to:", customerEmail);
  } catch (error) {
    console.error("❌ Error sending delivery email:", error.message);
  }
};


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
    });

    const customerName = order.delivery_address?.name || "Customer";
    const userOrderList = `${process.env.FRONTEND_URL}/dashboard/myorders`;

    // Generate Product Table
// Generate product table with gift notes if present
    const productTable = order.products.map(item =>
      item.variantPrices.map(variant => {
        const quantity = variant.quantity || 0;
        const pricePerUnit = variant.price || 0;
        const discountPercent = variant.discount || 0;

        const discountAmountPerUnit = (pricePerUnit * discountPercent) / 100;
        const finalUnitPrice = pricePerUnit - discountAmountPerUnit;
        const finalPriceTotal = finalUnitPrice * quantity;

        // Process gift notes to display them individually with numbering
        let giftNotesHtml = '';
        if (variant.isGiftWrap && variant.giftNotes?.length > 0) {
          giftNotesHtml = variant.giftNotes
            .map((note, index) => 
              `<div style="margin-top: ${index === 0 ? '6px' : '4px'}; font-size: 14px; color: #2c3e50;">
                <strong>Gift Message ${index + 1}:</strong> "${note}"
              </div>`
            )
            .join('');
        }

        return `
          <tr>
  <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="width: 80px;">
          <div style="width: 80px; height: 80px; background: #f9f9f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #f0f0f0;">
            <img src="https://i.postimg.cc/1Rdfc4qR/image.png" alt="${item.itemname}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          </div>
        </td>
        <td style="vertical-align: top; padding-left: 10px;">
          <div style="font-weight: 600; color: #111; font-size: 15px;">${item.itemname}</div>
          <div style="color: #555; font-size: 13px;">${variant.weight}</div>
          ${giftNotesHtml}
        </td>
        <td style="text-align: right; vertical-align: top; padding-left: 20px; white-space: nowrap;">
          <div style="font-weight: 600; color: #111; font-size: 15px;">₹${finalUnitPrice.toFixed(2)}</div>
          <div style="color: #777; font-size: 13px;">Qty: ${quantity}</div>
        </td>
      </tr>
    </table>
  </td>
</tr>

        `;
      }).join("")
    ).join("");

    // Email Template
    const mailOptions = {
      from: `Bake Flavours <${process.env.EMAIL}>`,
      to: customerEmail,
      subject: `🎉 Your Order #${order.orderId} Has Been Delivered!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Delivered</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .header-image {
                height: 120px !important;
              }
              .two-columns {
                display: block !important;
              }
              .column {
                width: 100% !important;
                display: block !important;
                padding: 0 !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          
          <!-- Pre-header Text -->
          <div style="display: none; max-height: 0; overflow: hidden;">
            Your order #${order.orderId} has been successfully delivered on ${deliveryDate}.
          </div>
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header Banner -->
            <div style="background-color: #e67e22; padding: 30px 40px; text-align: center; color: white;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Order Delivered</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Enjoy your delicious treats, ${customerName}!</p>
            </div>
            
            <!-- Order Status -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef6e6; border-bottom: 1px solid #f0f0f0; padding: 25px 20px;">
              <tr>
                <!-- ORDER NUMBER -->
                <td style="width: 33.33%; text-align: left;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">ORDER NUMBER</div>
                  <div style="font-size: 16px; font-weight: 600; color: #111;">#${order.orderId}</div>
                </td>

                <!-- DELIVERY DATE -->
                <td style="width: 33.33%; text-align: center;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">DELIVERED ON</div>
                  <div style="font-size: 16px; font-weight: 600; color: #111;">${deliveryDate}</div>
                </td>

                <!-- TOTAL -->
                <td style="width: 33.33%; text-align: right;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">ORDER TOTAL</div>
                  <div style="font-size: 16px; font-weight: 600; color: #e74c3c;">₹${order.finalOrderTotal?.toFixed(2) || "0.00"}</div>
                </td>
              </tr>
            </table>
            
            <!-- Delivery Content -->
            <div style="padding: 30px 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://i.postimg.cc/288LK5T3/delived-bake.png" alt="Delivered" style="width: 120px; height: auto; margin-bottom: 20px;">
                <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #111;">Your Order Has Arrived!</h2>
                <p style="margin: 0; font-size: 15px; color: #555; line-height: 1.5;">
                  We hope you enjoy every bite of your Bake Flavours experience. 
                  Thank you for trusting us with your sweet cravings!
                </p>
              </div>
              
              <!-- Products List -->
              <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Delivered Items</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  ${productTable}
                </tbody>
              </table>
              
              <!-- Order Summary -->
              <div style="margin-top: 30px; background-color: #f9f9f9; border-radius: 8px; padding: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px;">Subtotal</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111;">₹${order.finalOrderTotal?.toFixed(2) || "0.00"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px;">Shipping</td>
                    <td style="padding: 8px 0; text-align: right; color: #27ae60; font-weight: 600;">FREE</td>
                  </tr>
                  <tr style="border-top: 1px solid #e0e0e0;">
                    <td style="padding: 12px 0 0 0; font-size: 15px; font-weight: 700; color: #111;">Total Paid</td>
                    <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #e74c3c;">₹${order.finalOrderTotal?.toFixed(2) || "0.00"}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Feedback CTA -->
              <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f0f7ff; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">How Was Your Experience?</h3>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #555;">
                  We'd love to hear your feedback about your order and delivery experience.
                </p>
                <a href="${userOrderList}" style="display: inline-block; background-color: #e67e22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">Rate Your Order</a>
              </div>
            </div>
            
            <!-- Customer Support -->
            <div style="padding: 25px 40px; background-color: #f9f9f9; border-top: 1px solid #f0f0f0;">
              <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Need Help?</h3>
              <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                If you have any questions about your order, please contact our customer support team at <a href="mailto:support@bakeflavours.com" style="color: #e67e22; text-decoration: none;">support@bakeflavours.com</a> or call us at <a href="tel:180012345678" style="color: #e67e22; text-decoration: none;">1-800-1234-5678</a>.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 40px; background-color: #f1f1f1; text-align: center;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 30px; margin-bottom: 15px;">
              <div style="font-size: 12px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bake Flavours. All rights reserved.</p>
                <p style="margin: 0;">
                  <a href="${process.env.FRONTEND_URL}/privacy" style="color: #777; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                  <a href="${process.env.FRONTEND_URL}/terms" style="color: #777; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                  <a href="${process.env.FRONTEND_URL}/contact" style="color: #777; text-decoration: none; margin: 0 10px;">Contact Us</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Order delivered email sent to:", customerEmail);
  } catch (error) {
    console.error("❌ Error sending order delivered email:", error.message);
  }
};


// New Order Mail to Admin
export const sendNewOrderNotificationEmail = async (adminEmail, order) => {
  try {
    console.log("📧 Sending new order notification email to Admin:", adminEmail);

    const orderDate = new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const adminDashboardLink = `${process.env.FRONTEND_URL}/admin/dashboard/order-list`;
    const customerName = order.delivery_address?.name || "Customer";
    const customerPhone = order.delivery_address?.mobile || "Not provided";

    // Calculate total items
    const totalItems = order.products.reduce(
      (total, item) => total + item.variantPrices.reduce(
        (sum, variant) => sum + (variant.quantity || 0), 0
      ), 0
    );

    // Generate product details in a clean table format
// Generate product details in a clean table format (old layout, fixed calculations)
const productTable = order.products.map(item =>
  item.variantPrices.map(variant => {
    const quantity = variant.quantity || 0;
    const pricePerUnit = variant.price || 0;
    const discountPercent = variant.discount || 0;
    const isGiftWrap = variant.isGiftWrap || false;

    const discountAmountPerUnit = (pricePerUnit * discountPercent) / 100;
    const finalUnitPrice = pricePerUnit - discountAmountPerUnit;
    const finalPriceTotal = finalUnitPrice * quantity;

    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee; vertical-align: top;">
          ${item.itemname || "Unknown"}
          ${isGiftWrap ? '<div style="font-size:12px; color:#666;">(Gift Wrapped)</div>' : ''}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; vertical-align: top;">
          ${variant.weight || "N/A"}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; vertical-align: top;">
          ${quantity}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; vertical-align: top;">
          ₹${finalPriceTotal.toFixed(2)}
        </td>
      </tr>
    `;
  }).join("")
).join("");


    const mailOptions = {
      from: `Bake Flavours Orders <${process.env.EMAIL}>`,
      to: adminEmail,
      subject: `🛍️ New Order #${order.orderId} (₹${order.finalOrderTotal.toFixed(2)})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { border-bottom: 2px solid #e67e22; padding-bottom: 15px; margin-bottom: 20px; }
            .order-info { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .order-info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { text-align: left; background: #f5f5f5; padding: 10px; border-bottom: 2px solid #ddd; }
            .cta-button { 
              display: inline-block; 
              background: #e67e22; 
              color: white; 
              padding: 10px 20px; 
              text-decoration: none; 
              border-radius: 4px; 
              font-weight: bold; 
              margin-top: 15px;
            }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
<div class="header" style="width: 100%; border-bottom: 2px solid #e67e22; padding-bottom: 15px; margin-bottom: 20px;">
  <table style="width: 100%;">
    <tr>
      <td style="vertical-align: top;">
        <h2 style="margin: 0; color: #e67e22;">New Order Received</h2>
        <p style="margin: 5px 0; font-size: 14px; color: #666;">${orderDate}</p>
      </td>
      <td style="text-align: right;">
        <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px;">
      </td>
    </tr>
  </table>
</div>


            <div class="order-info">
              <p><strong>Order #:</strong> ${order.orderId}</p>
              <p><strong>Customer:</strong> ${customerName} (${customerPhone})</p>
              <p><strong>Delivery Address:</strong> ${order.delivery_address.address_line1}, ${order.delivery_address.city}, ${order.delivery_address.pincode}</p>
              <p><strong>Payment Method:</strong> ${order.payment_status || 'Not specified'}</p>
            </div>

            <h3 style="margin-bottom: 10px;">Order Details (${totalItems} items)</h3>
            <table>
              <thead>
                <tr>
                  <th style="width: 40%;">Product</th>
                  <th style="width: 20%; text-align: center;">Variant</th>
                  <th style="width: 15%; text-align: center;">Qty</th>
                  <th style="width: 25%; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${productTable}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right; padding: 10px; border-top: 2px solid #ddd; font-weight: bold;">Total:</td>
                  <td style="text-align: right; padding: 10px; border-top: 2px solid #ddd; font-weight: bold;">₹${order.finalOrderTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 25px;">
              <a href="${adminDashboardLink}" class="cta-button">View Order in Dashboard</a>
            </div>

            <div class="footer">
              <p>This is an automated notification. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Bake Flavours Admin System</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 New order notification email sent to Admin:", adminEmail);
  } catch (error) {
    console.error("❌ Error sending admin order notification email:", error.message);
  }
};

// cancel order mail to admin
export const sendOrderCancellationEmailToAdmin = async (adminEmail, order) => {
  try {
    console.log("📧 Sending order cancellation email to Admin:", adminEmail);

    const orderDate = new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const adminDashboardLink = `${process.env.FRONTEND_URL}/admin/dashboard/order-list`;
    const customerName = order.delivery_address?.name || "Customer";
    const customerPhone = order.delivery_address?.mobile || "Not provided";

    // Calculate total items
    const totalItems = order.products.reduce(
      (total, item) => total + item.variantPrices.reduce(
        (sum, variant) => sum + (variant.quantity || 0), 0
      ), 0
    );

    // Generate product details in a clean table format
    const productTable = order.products.map(item =>
      item.variantPrices.map(variant => {
        const quantity = variant.quantity || 0;
        const isGiftWrap = variant.isGiftWrap || false;

        return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; vertical-align: top;">
              ${item.itemname || "Unknown"}
              ${isGiftWrap ? '<div style="font-size:12px; color:#666;">(Gift Wrapped)</div>' : ''}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; vertical-align: top;">
              ${variant.weight || "N/A"}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; vertical-align: top;">
              ${quantity}
            </td>
          </tr>
        `;
      }).join("")
    ).join("");

    const mailOptions = {
      from: `Bake Flavours Orders <${process.env.EMAIL}>`,
      to: adminEmail,
      subject: `❌ Order Cancelled - #${order.orderId} (₹${order.finalOrderTotal.toFixed(2)})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { border-bottom: 2px solid #c0392b; padding-bottom: 15px; margin-bottom: 20px; }
            .order-info { background: #fef5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #c0392b; }
            .order-info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { text-align: left; background: #f5f5f5; padding: 10px; border-bottom: 2px solid #ddd; }
            .cta-button { 
              display: inline-block; 
              background: #c0392b; 
              color: white; 
              padding: 10px 20px; 
              text-decoration: none; 
              border-radius: 4px; 
              font-weight: bold; 
              margin-top: 15px;
            }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #777; }
            .cancellation-badge {
              background: #c0392b;
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header" style="width: 100%; border-bottom: 2px solid #c0392b; padding-bottom: 15px; margin-bottom: 20px;">
              <table style="width: 100%;">
                <tr>
                  <td style="vertical-align: top;">
                    <h2 style="margin: 0; color: #c0392b;">Order Cancelled</h2>
                    <p style="margin: 5px 0; font-size: 14px; color: #666;">${orderDate}</p>
                  </td>
                  <td style="text-align: right;">
                    <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px;">
                  </td>
                </tr>
              </table>
            </div>

            <div class="cancellation-badge">CANCELLED ORDER</div>

            <div class="order-info">
              <p><strong>Order #:</strong> ${order.orderId}</p>
              <p><strong>Customer:</strong> ${customerName} (${customerPhone})</p>
              ${order.delivery_address ? `<p><strong>Delivery Address:</strong> ${order.delivery_address.address_line1}, ${order.delivery_address.city}, ${order.delivery_address.pincode}</p>` : ''}
              <p><strong>Payment Method:</strong> ${order.payment_status || 'Not specified'}</p>
            </div>

            <h3 style="margin-bottom: 10px;">Order Details (${totalItems} items)</h3>
            <table>
              <thead>
                <tr>
                  <th style="width: 50%;">Product</th>
                  <th style="width: 25%; text-align: center;">Variant</th>
                  <th style="width: 25%; text-align: center;">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${productTable}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="text-align: right; padding: 10px; border-top: 2px solid #ddd; font-weight: bold;">Total Amount:</td>
                  <td style="text-align: right; padding: 10px; border-top: 2px solid #ddd; font-weight: bold;">₹${order.finalOrderTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 25px;">
              <a href="${adminDashboardLink}" class="cta-button">View Order in Dashboard</a>
            </div>

            <div class="footer">
              <p>This is an automated notification. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Bake Flavours Admin System</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Order cancellation email sent to Admin:", adminEmail);
  } catch (error) {
    console.error("❌ Error sending admin cancellation email:", error.message);
  }
};

// cancel order mail to USER

export const sendOrderCancellationEmailToUser = async (customerEmail, order) => {
  try {
    console.log("📧 Sending order cancellation email to user:", customerEmail);

    // Fetch user name from DB
    const user = await UserModel.findById(order.userId);
    const userName = user?.name || 'Customer';

    const orderDate = new Date(order.createdAt).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const userOrderList = `${process.env.FRONTEND_URL}/dashboard/myorders`;

    // Calculate total items count
    const totalItems = order.products.reduce(
      (total, item) => total + item.variantPrices.reduce((sum, variant) => sum + (variant.quantity || 0), 0),
      0
    );

    // Generate product table
 const productTable = order.products.map(item =>
      item.variantPrices.map(variant => {
        const quantity = variant.quantity || 0;
        const pricePerUnit = variant.price || 0;
        const discountPercent = variant.discount || 0;

        const discountAmountPerUnit = (pricePerUnit * discountPercent) / 100;
        const finalUnitPrice = pricePerUnit - discountAmountPerUnit;
        const finalPriceTotal = finalUnitPrice * quantity;

        // Process gift notes to display them individually with numbering
        let giftNotesHtml = '';
        if (variant.isGiftWrap && variant.giftNotes?.length > 0) {
          giftNotesHtml = variant.giftNotes
            .map((note, index) => 
              `<div style="margin-top: ${index === 0 ? '6px' : '4px'}; font-size: 14px; color: #2c3e50;">
                <strong>Gift Message ${index + 1}:</strong> "${note}"
              </div>`
            )
            .join('');
        }

        return `
          <tr>
  <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="width: 80px;">
          <div style="width: 80px; height: 80px; background: #f9f9f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #f0f0f0;">
            <img src="https://i.postimg.cc/1Rdfc4qR/image.png" alt="${item.itemname}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          </div>
        </td>
        <td style="vertical-align: top; padding-left: 10px;">
          <div style="font-weight: 600; color: #111; font-size: 15px;">${item.itemname}</div>
          <div style="color: #555; font-size: 13px;">${variant.weight}</div>
          ${giftNotesHtml}
        </td>
        <td style="text-align: right; vertical-align: top; padding-left: 20px; white-space: nowrap;">
          <div style="font-weight: 600; color: #111; font-size: 15px;">₹${finalUnitPrice.toFixed(2)}</div>
          <div style="color: #777; font-size: 13px;">Qty: ${quantity}</div>
        </td>
      </tr>
    </table>
  </td>
</tr>

        `;
      }).join("")
    ).join("");

    // Determine payment status message
    const paymentStatus = order.payment_status === 'ONLINE PAYMENT' 
      ? (order.isPaymentDone ? 'Paid Online' : 'Online Payment Not Received')
      : 'Cash on Delivery';

    // Determine refund message based on payment status and isPaymentDone
    let refundMessage = '';
    if (order.payment_status === 'ONLINE PAYMENT' && order.isPaymentDone) {
      refundMessage = 'Your refund will be processed within 5-7 business days. The refund will be credited to your original payment method.';
    } else if (order.payment_status === 'CASH ON DELIVERY') {
      refundMessage = 'Since your order was Cash on Delivery, no payment was received and no refund is required.';
    } else {
      refundMessage = 'Since your order was not paid, no refund is required.';
    }

    const mailOptions = {
      from: `Bake Flavours <${process.env.EMAIL}>`,
      to: customerEmail,
      subject: `❌ Order #${order.orderId} Cancelled`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Cancellation</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .header-image {
                height: 120px !important;
              }
              .two-columns {
                display: block !important;
              }
              .column {
                width: 100% !important;
                display: block !important;
                padding: 0 !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          
          <!-- Pre-header Text -->
          <div style="display: none; max-height: 0; overflow: hidden;">
            Your order #${order.orderId} has been cancelled. ${order.cancellationReason ? `Reason: ${order.cancellationReason}` : ''}
          </div>
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header Banner -->
            <div style="background-color: #c0392b; padding: 30px 40px; text-align: center; color: white;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Order Cancelled</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">We're sorry to see you go, ${userName}</p>
            </div>
            
            <!-- Order Status -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef5f5; border-bottom: 1px solid #f0f0f0; padding: 25px 20px;">
              <tr>
                <!-- ORDER NUMBER -->
                <td style="width: 33.33%; text-align: left;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">ORDER NUMBER</div>
                  <div style="font-size: 16px; font-weight: 600; color: #111;">#${order.orderId}</div>
                </td>

                <!-- ORDER DATE -->
                <td style="width: 33.33%; text-align: center;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">ORDER DATE</div>
                  <div style="font-size: 16px; font-weight: 600; color: #111;">${orderDate}</div>
                </td>

                <!-- PAYMENT STATUS -->
                <td style="width: 33.33%; text-align: right;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">PAYMENT STATUS</div>
                  <div style="font-size: 16px; font-weight: 600; color: #111;">${paymentStatus}</div>
                </td>
              </tr>
            </table>
        
            <!-- Order Summary -->
            <div style="padding: 30px 40px;">
              <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111;">Order Summary</h2>
              
              <!-- Products List -->
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  ${productTable}
                </tbody>
              </table>
              
              <!-- Order Totals -->
              <div style="margin-top: 30px; background-color: #f9f9f9; border-radius: 8px; padding: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Order Total</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 14px;">Subtotal (${totalItems} items)</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111;">₹${order.finalOrderTotal.toFixed(2)}</td>
                  </tr>
                  
                  ${order.special_Gift_packing > 0 ? `
                    <tr>
                      <td style="padding: 8px 0; color: #555; font-size: 14px;">Gift Wrapping</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111;">+₹${order.special_Gift_packing.toFixed(2)}</td>
                    </tr>
                  ` : ''}
                  
                  ${order.delivery_charges > 0 ? `
                    <tr>
                      <td style="padding: 8px 0; color: #555; font-size: 14px;">Delivery Charges</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111;">+₹${order.delivery_charges.toFixed(2)}</td>
                    </tr>
                  ` : ''}
                  
                  <tr style="border-top: 1px solid #e0e0e0;">
                    <td style="padding: 12px 0 0 0; font-size: 15px; font-weight: 700; color: #111;">Total Amount</td>
                    <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #c0392b;">₹${order.finalOrderTotal.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <!-- Next Steps -->
            <div style="padding: 0 40px 30px 40px;">
              <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Next Steps</h3>
              <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; font-size: 14px; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">
                  ${refundMessage}
                </p>
                <p style="margin: 0;">
                  You can view your order history and cancellation details in your account.
                </p>
              </div>

              <div style="text-align: center; margin-top: 20px;">
                <a href="${userOrderList}" style="display: inline-block; background-color: #c0392b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">View Your Orders</a>
              </div>
            </div>
            
            <!-- Customer Support -->
            <div style="padding: 25px 40px; background-color: #f9f9f9; border-top: 1px solid #f0f0f0;">
              <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111;">Need Help?</h3>
              <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                If you have any questions about your cancellation or refund, please contact our customer support team at <a href="mailto:support@bakeflavours.com" style="color: #c0392b; text-decoration: none;">support@bakeflavours.com</a> or call us at <a href="tel:180012345678" style="color: #c0392b; text-decoration: none;">1-800-1234-5678</a>.
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                Changed your mind? You can place a new order anytime at <a href="${process.env.FRONTEND_URL}" style="color: #c0392b; text-decoration: none;">BakeFlavours.com</a>.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 40px; background-color: #f1f1f1; text-align: center;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 30px; margin-bottom: 15px;">
              <div style="font-size: 12px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bake Flavours. All rights reserved.</p>
                <p style="margin: 0;">
                  <a href="${process.env.FRONTEND_URL}/privacy" style="color: #777; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                  <a href="${process.env.FRONTEND_URL}/terms" style="color: #777; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                  <a href="${process.env.FRONTEND_URL}/contact" style="color: #777; text-decoration: none; margin: 0 10px;">Contact Us</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Order cancellation email sent to user:", customerEmail);
  } catch (error) {
    console.error("❌ Error sending user cancellation email:", error.message);
  }
};



export async function sendOrderAssignedEmail(email, order) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Format payment status display
    const paymentStatus = order.payment_status === 'ONLINE PAYMENT' 
      ? (order.isPaymentDone ? 'Paid Online' : 'Online Payment Pending')
      : 'Cash on Delivery';


    const mailOptions = {
      from: `Bake Flavours Delivery <${process.env.EMAIL}>`,
      to: email,
      subject: `🚚 New Delivery Assignment - Order #${order.orderId}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Delivery Assignment</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .header-image {
                height: 120px !important;
              }
              .two-columns {
                display: block !important;
              }
              .column {
                width: 100% !important;
                display: block !important;
                padding: 0 !important;
              }
              .info-card {
                margin: 10px 0 !important;
              }
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header Banner -->
            <div style="background-color: #2c3e50; padding: 25px 30px; text-align: center; color: white;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px; margin-bottom: 15px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600;">NEW DELIVERY ASSIGNED</h1>
              <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">Please complete this delivery as per schedule</p>
            </div>
            
            <!-- Order Summary -->
            <div style="padding: 25px 30px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div>
                  <div style="font-size: 13px; color: #666;">ORDER NUMBER</div>
                  <div style="font-size: 18px; font-weight: 700; color: #2c3e50;">#${order.orderId}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 13px; color: #666;">TOTAL AMOUNT</div>
                  <div style="font-size: 18px; font-weight: 700; color: #27ae60;">₹${order.finalOrderTotal.toFixed(2)}</div>
                </div>
              </div>

              <!-- Payment Status Cards -->
              <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 150px; background: #f8f9fa; border-radius: 8px; padding: 15px; border-left: 4px solid #3498db;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">PAYMENT METHOD</div>
                  <div style="font-size: 16px; font-weight: 600; color: #2c3e50;">${paymentStatus}</div>
                </div>
              </div>
              
              <!-- Delivery Address -->
              <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #2c3e50;">
                  <span style="display: inline-block; width: 24px; height: 24px; background: #3498db; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 8px;">✓</span>
                  DELIVERY ADDRESS
                </h3>
                <div style="line-height: 1.6;">
                  <div style="font-weight: 600; font-size: 15px; margin-bottom: 5px;">${order.delivery_address.name}</div>
                  <div>${order.delivery_address.address_line1}</div>
                  ${order.delivery_address.address_line2 ? `<div>${order.delivery_address.address_line2}</div>` : ''}
                  <div>${order.delivery_address.city}, ${order.delivery_address.state} - ${order.delivery_address.pincode}</div>
                  <div>${order.delivery_address.country}</div>
                  <div style="margin-top: 10px;">
                    <strong>Mobile:</strong> 
                    <a href="tel:${order.delivery_address.mobile}" style="color: #3498db; text-decoration: none;">
                      ${order.delivery_address.mobile}
                    </a>
                  </div>
                </div>
              </div>

              <!-- Products List -->
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #2c3e50;">
                  <span style="display: inline-block; width: 24px; height: 24px; background: #e67e22; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 8px;">!</span>
                  ITEMS TO DELIVER
                </h3>
                <div style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                  ${order.products.map(item => `
                    <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                      <div style="width: 50px; height: 50px; background: #f9f9f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-right: 15px; flex-shrink: 0;">
                        <img src="${item.coverimage || 'https://i.postimg.cc/1Rdfc4qR/image.png'}" alt="${item.itemname}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                      </div>
                      <div style="flex-grow: 1;">
                        <div style="font-weight: 600; margin-bottom: 3px;">${item.itemname}</div>
                        ${item.variantPrices.map(variant => `
                          <div style="font-size: 13px; color: #666;">
                            ${variant.weight} × ${variant.quantity} 
                            <span style="float: right;">₹${variant.price * variant.quantity}</span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Special Instructions -->
              <div style="background: #fff8e1; border-radius: 8px; padding: 15px; margin-bottom: 20px; border-left: 4px solid #f39c12;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #e67e22;">DELIVERY INSTRUCTIONS</h3>
                <div style="font-size: 14px; line-height: 1.5;">
                  ${order.payment_status === 'CASH ON DELIVERY' ? `
                    <p style="margin: 0 0 10px 0;">
                      <strong>Cash Collection:</strong> Please collect ₹${order.finalOrderTotal.toFixed(2)} from the customer upon delivery.
                    </p>
                  ` : ''}
                  <p style="margin: 0;">
                    <strong>Note:</strong> Please handle all items with care and ensure the customer checks the package before signing.
                  </p>
                </div>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 25px;">
                <a href="${process.env.DELIVERY_PARTNER_DASHBOARD_URL || '#'}" style="display: inline-block; background-color: #2c3e50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">View Full Order Details</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 30px; background-color: #f1f1f1; text-align: center; border-top: 1px solid #ddd;">
              <div style="font-size: 12px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bake Flavours Delivery Network. All rights reserved.</p>
                <p style="margin: 0;">
                  Need help? Contact support at <a href="mailto:delivery@bakeflavours.com" style="color: #3498db; text-decoration: none;">delivery@bakeflavours.com</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
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
    console.log(
      "📝 Orders received for email:",
      JSON.stringify(orders, null, 2)
    );

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Format payment status display
    const formatPaymentStatus = (order) => {
      return order.payment_status === 'ONLINE PAYMENT' 
        ? (order.isPaymentDone ? 'Paid Online' : 'Online Payment Pending')
        : 'Cash on Delivery';
    };

    let orderCards = orders
      .map((order, index) => {
        if (!order.delivery_address) {
          return `
            <div style="background: #fff8e1; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div>
                  <div style="font-size: 13px; color: #666;">ORDER #${index + 1}</div>
                  <div style="font-size: 18px; font-weight: 700; color: #2c3e50;">#${order.orderId}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 13px; color: #666;">TOTAL AMOUNT</div>
                  <div style="font-size: 18px; font-weight: 700; color: #27ae60;">₹${order.finalOrderTotal?.toFixed(2) || 'N/A'}</div>
                </div>
              </div>
              <div style="color: #e74c3c; font-weight: 600; margin-top: 10px;">
                ⚠️ Missing delivery address - Please check dashboard for details
              </div>
            </div>
          `;
        }
        
        return `
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div>
                <div style="font-size: 13px; color: #666;">ORDER #${index + 1}</div>
                <div style="font-size: 18px; font-weight: 700; color: #2c3e50;">#${order.orderId}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 13px; color: #666;">TOTAL AMOUNT</div>
                <div style="font-size: 18px; font-weight: 700; color: #27ae60;">₹${order.finalOrderTotal?.toFixed(2) || 'N/A'}</div>
              </div>
            </div>

            <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 150px; background: #e8f4fd; border-radius: 8px; padding: 12px; border-left: 4px solid #3498db;">
                <div style="font-size: 13px; color: #666; margin-bottom: 5px;">PAYMENT METHOD</div>
                <div style="font-size: 15px; font-weight: 600; color: #2c3e50;">${formatPaymentStatus(order)}</div>
              </div>
            </div>

            <div style="background: #fff; border-radius: 6px; padding: 15px; margin-bottom: 15px; border: 1px solid #eee;">
              <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #2c3e50;">
                <span style="display: inline-block; width: 20px; height: 20px; background: #3498db; color: white; border-radius: 50%; text-align: center; line-height: 20px; margin-right: 8px; font-size: 12px;">✓</span>
                DELIVERY ADDRESS
              </h3>
              <div style="line-height: 1.5; font-size: 14px;">
                <div style="font-weight: 600; margin-bottom: 5px;">${order.delivery_address.name || 'N/A'}</div>
                <div>${order.delivery_address.address_line1 || 'N/A'}</div>
                ${order.delivery_address.address_line2 ? `<div>${order.delivery_address.address_line2}</div>` : ''}
                <div>${order.delivery_address.city || 'N/A'}, ${order.delivery_address.state || 'N/A'} - ${order.delivery_address.pincode || 'N/A'}</div>
                <div>${order.delivery_address.country || 'N/A'}</div>
                <div style="margin-top: 8px;">
                  <strong>Mobile:</strong> 
                  <a href="tel:${order.delivery_address.mobile}" style="color: #3498db; text-decoration: none;">
                    ${order.delivery_address.mobile || 'N/A'}
                  </a>
                </div>
              </div>
            </div>

            <div style="background: #fff; border-radius: 6px; padding: 15px; border: 1px solid #eee;">
              <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #2c3e50;">
                <span style="display: inline-block; width: 20px; height: 20px; background: #e67e22; color: white; border-radius: 50%; text-align: center; line-height: 20px; margin-right: 8px; font-size: 12px;">!</span>
                ITEMS TO DELIVER (${order.products?.length || 0})
              </h3>
              ${order.products?.map(item => `
                <div style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center;">
                  <div style="width: 40px; height: 40px; background: #f9f9f9; border-radius: 4px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-right: 12px; flex-shrink: 0;">
                    <img src="${item.coverimage || 'https://i.postimg.cc/1Rdfc4qR/image.png'}" alt="${item.itemname}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                  </div>
                  <div style="flex-grow: 1;">
                    <div style="font-weight: 600; margin-bottom: 3px; font-size: 14px;">${item.itemname}</div>
                    ${item.variantPrices?.map(variant => `
                      <div style="font-size: 12px; color: #666;">
                        ${variant.weight} × ${variant.quantity} 
                        <span style="float: right;">₹${(variant.price * variant.quantity).toFixed(2)}</span>
                      </div>
                    `).join('') || ''}
                  </div>
                </div>
              `).join('') || '<div style="color: #666; font-size: 14px;">No items information available</div>'}
            </div>
          </div>
        `;
      })
      .join("");

    let mailOptions = {
      from: `Bake Flavours Delivery <${process.env.EMAIL}>`,
      to: email,
      subject: `🚚 Multiple Delivery Assignments (${orders.length} Orders)`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bulk Delivery Assignments</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .header-image {
                height: 120px !important;
              }
              .two-columns {
                display: block !important;
              }
              .column {
                width: 100% !important;
                display: block !important;
                padding: 0 !important;
              }
              .info-card {
                margin: 10px 0 !important;
              }
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header Banner -->
            <div style="background-color: #2c3e50; padding: 25px 30px; text-align: center; color: white;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px; margin-bottom: 15px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600;">MULTIPLE DELIVERIES ASSIGNED</h1>
              <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">You have ${orders.length} new delivery assignments</p>
            </div>
            
            <!-- Order Summary -->
            <div style="padding: 25px 30px;">
              <div style="background: #e8f4fd; border-radius: 8px; padding: 15px; margin-bottom: 20px; border-left: 4px solid #3498db;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #2c3e50;">SUMMARY</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                  <div style="flex: 1; min-width: 120px;">
                    <div style="font-size: 13px; color: #666;">TOTAL ORDERS</div>
                    <div style="font-size: 18px; font-weight: 700; color: #2c3e50;">${orders.length}</div>
                  </div>
                  <div style="flex: 1; min-width: 120px;">
                    <div style="font-size: 13px; color: #666;">ONLINE PAYMENTS</div>
                    <div style="font-size: 18px; font-weight: 700; color: #2c3e50;">${orders.filter(o => o.payment_status === 'ONLINE PAYMENT').length}</div>
                  </div>
                  <div style="flex: 1; min-width: 120px;">
                    <div style="font-size: 13px; color: #666;">CASH ON DELIVERY</div>
                    <div style="font-size: 18px; font-weight: 700; color: #2c3e50;">${orders.filter(o => o.payment_status === 'CASH ON DELIVERY').length}</div>
                  </div>
                </div>
              </div>

              <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #2c3e50; text-align: center;">
                YOUR DELIVERY ASSIGNMENTS
              </h2>

              ${orderCards}

              <!-- Special Instructions -->
              <div style="background: #fff8e1; border-radius: 8px; padding: 15px; margin-bottom: 20px; border-left: 4px solid #f39c12;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #e67e22;">DELIVERY INSTRUCTIONS</h3>
                <div style="font-size: 14px; line-height: 1.5;">
                  <p style="margin: 0 0 10px 0;">
                    <strong>Cash Collection:</strong> Please collect cash for all COD orders as marked above.
                  </p>
                  <p style="margin: 0;">
                    <strong>Note:</strong> Please handle all items with care and ensure customers check their packages before signing.
                  </p>
                </div>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 25px;">
                <a href="${process.env.DELIVERY_PARTNER_DASHBOARD_URL || '#'}" style="display: inline-block; background-color: #2c3e50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">View All Orders in Dashboard</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 30px; background-color: #f1f1f1; text-align: center; border-top: 1px solid #ddd;">
              <div style="font-size: 12px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bake Flavours Delivery Network. All rights reserved.</p>
                <p style="margin: 0;">
                  Need help? Contact support at <a href="mailto:delivery@bakeflavours.com" style="color: #3498db; text-decoration: none;">delivery@bakeflavours.com</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Bulk order assignment email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Error sending bulk assignment email:", error);
  }
}


export const sendOrderCancellationEmailToDeliveryPartner = async (
  partnerEmail,
  order
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const orderDate = new Date(order.createdAt).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const deliveryPanelLink = `${process.env.FRONTEND_URL}/delivery/dashboard/assigned-orders`;

    // Generate product list
    const productList = order.products.map(item => 
      item.variantPrices.map(variant => `
        <div style="padding: 12px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
          <div style="width: 50px; height: 50px; background: #f9f9f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-right: 15px; flex-shrink: 0;">
            <img src="${item.coverimage || 'https://i.postimg.cc/1Rdfc4qR/image.png'}" alt="${item.itemname}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          </div>
          <div style="flex-grow: 1;">
            <div style="font-weight: 600; margin-bottom: 3px;">${item.itemname}</div>
            <div style="font-size: 13px; color: #666;">
              ${variant.weight} × ${variant.quantity}
              <span style="float: right;">₹${variant.price * variant.quantity}</span>
            </div>
          </div>
        </div>
      `).join('')
    ).join('');

    const mailOptions = {
      from: `Bake Flavours Delivery <${process.env.EMAIL}>`,
      to: partnerEmail,
      subject: `❌ Delivery Assignment Cancelled - Order #${order.orderId}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Assignment Cancelled</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .header-image {
                height: 120px !important;
              }
              .two-columns {
                display: block !important;
              }
              .column {
                width: 100% !important;
                display: block !important;
                padding: 0 !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header Banner -->
            <div style="background-color: #e74c3c; padding: 25px 30px; text-align: center; color: white;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px; margin-bottom: 15px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600;">DELIVERY ASSIGNMENT CANCELLED</h1>
              <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">Order #${order.orderId} has been cancelled</p>
            </div>
            
            <!-- Order Summary -->
            <div style="padding: 25px 30px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="margin-bottom: 15px;">
                  <div style="font-size: 13px; color: #666;">ORDER NUMBER</div>
                  <div style="font-size: 18px; font-weight: 700; color: #2c3e50;">#${order.orderId}</div>
                </div>
                <div style="margin-bottom: 15px;">
                  <div style="font-size: 13px; color: #666;">CANCELLED ON</div>
                  <div style="font-size: 16px; font-weight: 600; color: #2c3e50;">${orderDate}</div>
                </div>
                <div style="margin-bottom: 15px;">
                  <div style="font-size: 13px; color: #666;">ORDER TOTAL</div>
                  <div style="font-size: 18px; font-weight: 700; color: #e74c3c;">₹${order.finalOrderTotal.toFixed(2)}</div>
                </div>
              </div>

              <!-- Cancellation Notice -->
              <div style="background: #fef5f5; border-radius: 8px; padding: 15px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #e74c3c;">CANCELLATION NOTICE</h3>
                <div style="font-size: 14px; line-height: 1.5;">
                  <p style="margin: 0 0 10px 0;">
                    This order has been cancelled by the customer or system. Please disregard your previous assignment for this order.
                  </p>
                  ${order.cancellationReason ? `
                    <p style="margin: 0;">
                      <strong>Reason:</strong> ${order.cancellationReason}
                    </p>
                  ` : ''}
                </div>
              </div>

              <!-- Products List -->
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #2c3e50;">
                  <span style="display: inline-block; width: 24px; height: 24px; background: #e67e22; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 8px;">!</span>
                  CANCELLED ITEMS
                </h3>
                <div style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                  ${productList}
                </div>
              </div>

              <!-- Next Steps -->
              <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #2c3e50;">NEXT STEPS</h3>
                <div style="font-size: 14px; line-height: 1.5;">
                  <p style="margin: 0 0 10px 0;">
                    This order has been removed from your assigned deliveries. No further action is required.
                  </p>
                  <p style="margin: 0;">
                    You may check your dashboard for new delivery assignments.
                  </p>
                </div>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 25px;">
                <a href="${deliveryPanelLink}" style="display: inline-block; background-color: #2c3e50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">View Your Dashboard</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 30px; background-color: #f1f1f1; text-align: center; border-top: 1px solid #ddd;">
              <div style="font-size: 12px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bake Flavours Delivery Network. All rights reserved.</p>
                <p style="margin: 0;">
                  Need help? Contact support at <a href="mailto:delivery@bakeflavours.com" style="color: #3498db; text-decoration: none;">delivery@bakeflavours.com</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Order cancellation email sent to Delivery Partner:", partnerEmail);
  } catch (error) {
    console.error("❌ Error sending cancellation email to delivery partner:", error.message);
  }
};

export async function sendOrderReassignedEmail(email, orders) {
  try {
    if (!email || !orders || orders.length === 0) {
      console.log("❌ No valid email or orders to send reassignment notification.");
      return;
    }

    console.log("📧 Sending reassignment email to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Generate order cards
    const orderCards = orders.map(order => `
      <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #e74c3c;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div>
            <div style="font-size: 13px; color: #666;">ORDER NUMBER</div>
            <div style="font-size: 16px; font-weight: 600; color: #2c3e50;">#${order.orderId}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 13px; color: #666;">ORDER TOTAL</div>
            <div style="font-size: 16px; font-weight: 600; color: #27ae60;">₹${order.finalOrderTotal.toFixed(2)}</div>
          </div>
        </div>
        <div style="font-size: 14px; color: #666;">
          <div><strong>Customer:</strong> ${order.delivery_address?.name || 'Not specified'}</div>
          <div><strong>Location:</strong> ${order.delivery_address?.city || ''}, ${order.delivery_address?.state || ''}</div>
        </div>
      </div>
    `).join('');

    const mailOptions = {
      from: `Bake Flavours Delivery <${process.env.EMAIL}>`,
      to: email,
      subject: `🔄 Delivery Assignment Update - ${orders.length} Order${orders.length > 1 ? 's' : ''} Reassigned`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Reassignment</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .header-image {
                height: 120px !important;
              }
              .two-columns {
                display: block !important;
              }
              .column {
                width: 100% !important;
                display: block !important;
                padding: 0 !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header Banner -->
            <div style="background-color: #2c3e50; padding: 25px 30px; text-align: center; color: white;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px; margin-bottom: 15px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600;">DELIVERY REASSIGNMENT NOTICE</h1>
              <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">${orders.length} order${orders.length > 1 ? 's' : ''} reassigned</p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 25px 30px;">
              <div style="background: #fef5f5; border-radius: 8px; padding: 15px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #e74c3c;">IMPORTANT NOTICE</h3>
                <div style="font-size: 14px; line-height: 1.5;">
                  <p style="margin: 0 0 10px 0;">
                    The following delivery assignment${orders.length > 1 ? 's have' : ' has'} been reassigned to another partner:
                  </p>
                </div>
              </div>

              <!-- Reassigned Orders -->
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #2c3e50;">
                  <span style="display: inline-block; width: 24px; height: 24px; background: #e74c3c; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 8px;">!</span>
                  REASSIGNED ORDER${orders.length > 1 ? 'S' : ''}
                </h3>
                ${orderCards}
              </div>

              <!-- Next Steps -->
              <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #2c3e50;">NEXT STEPS</h3>
                <div style="font-size: 14px; line-height: 1.5;">
                  <p style="margin: 0 0 10px 0;">
                    These orders have been removed from your assigned deliveries. No further action is required.
                  </p>
                  <p style="margin: 0;">
                    You may check your dashboard for new delivery assignments.
                  </p>
                </div>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 25px;">
                <a href="${process.env.DELIVERY_PARTNER_DASHBOARD_URL || '#'}" style="display: inline-block; background-color: #2c3e50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">View Your Dashboard</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 30px; background-color: #f1f1f1; text-align: center; border-top: 1px solid #ddd;">
              <div style="font-size: 12px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bake Flavours Delivery Network. All rights reserved.</p>
                <p style="margin: 0;">
                  Need help? Contact support at <a href="mailto:delivery@bakeflavours.com" style="color: #3498db; text-decoration: none;">delivery@bakeflavours.com</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reassignment email sent successfully to ${email} for ${orders.length} order(s).`);
  } catch (error) {
    console.error("❌ Error sending reassignment email:", error);
  }
}


export const sendResetOTP = async (email, otp) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: `Bake Flavours Support <${process.env.EMAIL}>`,
      to: email,
      subject: "🔐 Password Reset OTP - Bake Flavours",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Bake Flavours</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .otp-container {
                font-size: 20px !important;
                padding: 15px 20px !important;
              }
              .button {
                width: 100% !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header Banner -->
            <div style="background-color: #2c3e50; padding: 25px 30px; text-align: center; color: white;">
              <img src="https://i.postimg.cc/xj5Xkt0m/Bake-Flavors-2.png" alt="Bake Flavours" style="max-height: 40px; margin-bottom: 15px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600;">PASSWORD RESET REQUEST</h1>
              <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">Secure your account with this OTP</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">
                We received a request to reset your password for your Bake Flavours account. 
                Please use the following One-Time Password (OTP) to verify your identity:
              </p>

              <!-- OTP Box -->
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background-color: #f0f0f0; border-radius: 8px; padding: 20px 30px; border: 2px dashed #d9534f;">
                  <div style="font-size: 13px; color: #666; margin-bottom: 5px;">YOUR VERIFICATION CODE</div>
                  <div style="font-size: 28px; font-weight: 700; letter-spacing: 3px; color: #d9534f;">${otp}</div>
                </div>
              </div>

              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">
                This code is valid for <strong>10 minutes</strong>. For your security, please do not share this code with anyone.
              </p>

              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 25px 0; border-left: 4px solid #f39c12;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #e67e22;">DIDN'T REQUEST THIS?</h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                  If you didn't request a password reset, please ignore this email or contact our support team immediately at 
                  <a href="mailto:support@bakeflavours.com" style="color: #3498db; text-decoration: none;">support@bakeflavours.com</a>.
                </p>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 25px;">
                <a href="${process.env.FRONTEND_URL || '#'}" style="display: inline-block; background-color: #d9534f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">Return to Bake Flavours</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 30px; background-color: #f1f1f1; text-align: center; border-top: 1px solid #ddd;">
              <div style="font-size: 12px; color: #777; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bake Flavours. All rights reserved.</p>
                <p style="margin: 0;">
                  Need help? Contact us at <a href="mailto:support@bakeflavours.com" style="color: #3498db; text-decoration: none;">support@bakeflavours.com</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Password reset OTP sent to:", email);
  } catch (error) {
    console.error("❌ Error sending password reset OTP:", error);
  }
};
