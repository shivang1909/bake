// utils/BakeryInvoicePDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';


Font.register({
  family: 'NotoSans',
  src: 'https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNb4j5Ba_2c7A.ttf' // TTF format works best
});
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'NotoSans',
    backgroundColor: '#ffffff'
  },
 
  // Header Section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '2 solid #20B2AA'
  },
 
  brandSection: {
    flex: 1
  },
 
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
 
  logoBox: {
    width: 25,
    height: 25,
    marginRight: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
 
  logoTextB: {
    backgroundColor: '#FF8C42',
    color: '#FFFFFF'
  },
 
  logoTextA: {
    backgroundColor: '#20B2AA',
    color: '#FFFFFF'
  },
 
  logoTextK: {
    backgroundColor: '#FF8C42',
    color: '#FFFFFF'
  },
 
  logoTextE: {
    backgroundColor: '#20B2AA',
    color: '#FFFFFF'
  },
 
  logoChar: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
 
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 5,
    marginLeft: 10
  },
 
  tagline: {
    fontSize: 12,
    color: '#FF8C42',
    fontStyle: 'italic',
    marginBottom: 8
  },
 
  businessInfo: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.4
  },
 
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20B2AA',
    textAlign: 'right',
    marginBottom: 5
  },
 
  invoiceNumber: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'right'
  },
 
  // Customer & Order Info Section
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25
  },
 
  infoBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 5
  },
 
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
 
  infoText: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 3,
    lineHeight: 1.3
  },
 
  // Table Styles
 // Table
  table: {
    width: '100%',
    marginBottom: 20,
  },


  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#20B2AA',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },


  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },


  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderBottom: '1 solid #E0E0E0',
  },


  tableRowAlt: {
    backgroundColor: '#FAFAFA',
  },


  tableCell: {
    fontSize: 9,
    color: '#333333',
    paddingHorizontal: 3,
    textAlign: 'center',
  },


  // Fixed Column Widths
  colSrNo: { width: '7%' },
  colItem: { width: '28%', textAlign: 'left' },
  colWeight: { width: '14%' },
  colQty: { width: '10%' },
  colPrice: { width: '13%' },
  colDiscount: { width: '13%' },
  colTotal: { width: '15%' },


  // Summary Section
  summarySection: {
    marginTop: 15,
    paddingTop: 15,
    borderTop: '1 solid #20B2AA',
  },


  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 10,
  },


  summaryLabel: {
    fontSize: 10,
    color: '#666666',
  },


  summaryValue: {
    fontSize: 10,
    color: '#333333',
    fontWeight: 'bold',
  },


  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FF8C42',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },


  totalLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },


  totalValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Footer Section
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1 solid #E0E0E0'
  },
 
  thankYouText: {
    fontSize: 14,
    color: '#20B2AA',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10
  },
 
  footerText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 1.4
  },
 
  // Payment Status Badge
  paymentBadge: {
    backgroundColor: '#28A745',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 3,
    alignSelf: 'flex-start'
  },
 
  paymentBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  logoImage: {
  width: 120,
  height: 60,
  objectFit: 'contain', // only valid in some PDF libraries
  marginBottom: 5
}
});


const BakeryInvoicePDF = ({ order }) => {
  console.log("Generating bakery invoice for order:", order);


const Logo = 'https://i.postimg.cc/GmB2Q313/Bake-Flavors.png';


  const deliveryCharges = order.delivery_charges || 0;
const giftPacking = order.special_Gift_packing || 0;
const promoCodeDiscount = order.promocodeDiscount || 0;
const promoCode = order.promo_code || null;


const subtotal = order.products.reduce((acc, item) => {
  return acc + item.variantPrices.reduce((sum, variant) => {
    const unitPrice = variant.price - (variant.discount || 0);
    return sum + (variant.quantity * unitPrice);
  }, 0);
}, 0);
const finalAmount = subtotal + deliveryCharges + giftPacking - promoCodeDiscount;


  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return '#28A745';
      case 'pending':
        return '#FFC107';
      case 'failed':
        return '#DC3545';
      default:
        return '#6C757D';
    }
  };


  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
     
      // Header Section
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          { style: styles.brandSection },
          React.createElement(
  View,
  { style: styles.logoContainer },
  React.createElement(Image, {
    src: Logo, // your logo URL or base64
    style: styles.logoImage
  })
),
          React.createElement(
            View,
            { style: styles.businessInfo },
            React.createElement(Text, null, 'Ahmedabad, Gujarat, India'),
            React.createElement(Text, null, '+91 63514-96499'),
            React.createElement(Text, null, 'bakeflavours2018@gmail.com'),
            React.createElement(Text, null, 'www.bakeflavours.com'),
          )
        ),
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.invoiceTitle }, 'INVOICE'),
          React.createElement(Text, { style: styles.invoiceNumber }, `#${order.orderId}`)
        )
      ),
     
      // Customer & Order Information
      React.createElement(
        View,
        { style: styles.infoSection },
        React.createElement(
  View,
  { style: styles.infoBox },
  React.createElement(Text, { style: styles.infoTitle }, 'Bill To'),
  React.createElement(Text, { style: styles.infoText }, order.delivery_address.name || 'Valued Customer'),
  React.createElement(Text, { style: styles.infoText }, order.delivery_address.mobile?.toString() || 'N/A'),


  // Address Line 1 and 2
  React.createElement(
    Text,
    { style: styles.infoText },
    `${order.delivery_address.address_line1 || ''}, ${order.delivery_address.address_line2 || 'Pickup Order'}`
  ),


  // City, State, Pincode, Country
  React.createElement(
    Text,
    { style: styles.infoText },
    `${order.delivery_address.city || ''}, ${order.delivery_address.state || ''} - ${order.delivery_address.pincode || ''}, ${order.delivery_address.country || ''}`
  ),


  React.createElement(Text, { style: styles.infoText }, order.customerEmail || '')
),


        React.createElement(
          View,
          { style: styles.infoBox },
          React.createElement(Text, { style: styles.infoTitle }, 'Order Details'),
          React.createElement(Text, { style: styles.infoText }, `Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`),
          React.createElement(Text, { style: styles.infoText }, `Order Time: ${new Date(order.createdAt).toLocaleTimeString("en-IN")}`),
          // React.createElement(Text, { style: styles.infoText }, `Delivery Date: ${order.deliveryDate || 'Same Day'}`),
          React.createElement(
            View,
            {
              style: {
                ...styles.paymentBadge,
                backgroundColor: getPaymentStatusColor(order.payment_status)
              }
            },
            React.createElement(Text, { style: styles.paymentBadgeText }, `Payment: ${order.payment_status || 'Pending'}`)
          )
        )
      ),
     
      // Products Table
     React.createElement(
  View,
  { style: styles.table },


  // Table Header
  React.createElement(
    View,
    { style: styles.tableHeader },
    React.createElement(Text, { style: [styles.tableHeaderText, styles.colSrNo] }, 'Sr.'),
    React.createElement(Text, { style: [styles.tableHeaderText, styles.colItem] }, 'Product Name'),
    React.createElement(Text, { style: [styles.tableHeaderText, styles.colWeight] }, 'Weight/Size'),
    React.createElement(Text, { style: [styles.tableHeaderText, styles.colQty] }, 'Qty'),
    React.createElement(Text, { style: [styles.tableHeaderText, styles.colPrice] }, 'Unit Price'),
    React.createElement(Text, { style: [styles.tableHeaderText, styles.colDiscount] }, 'Discount'),
    React.createElement(Text, { style: [styles.tableHeaderText, styles.colTotal] }, 'Amount')
  ),


  // Table Rows
...(() => {
  let serial = 1;
  const rows = [];


  order.products.forEach((item, i) => {
    item.variantPrices.forEach((variant, j) => {
      const isEven = (i + j) % 2 === 0;
      const amount = variant.quantity * (variant.price - (variant.discount || 0));


      rows.push(
        React.createElement(
          View,
          {
            style: [styles.tableRow, isEven ? styles.tableRowAlt : null],
            key: `${i}-${j}`
          },
          React.createElement(Text, { style: [styles.tableCell, styles.colSrNo] }, serial.toString()),
          React.createElement(Text, { style: [styles.tableCell, styles.colItem] }, item.itemname),
          React.createElement(Text, { style: [styles.tableCell, styles.colWeight] }, variant.weight),
          React.createElement(Text, { style: [styles.tableCell, styles.colQty] }, variant.quantity.toString()),
          React.createElement(Text, { style: [styles.tableCell, styles.colPrice] }, `\u20B9${variant.price}`),
          React.createElement(Text, { style: [styles.tableCell, styles.colDiscount] }, `\u20B9${variant.discount || 0}`),
          React.createElement(Text, { style: [styles.tableCell, styles.colTotal] }, `\u20B9${amount}`)
        )
      );


      serial++; // Increment after pushing
    });
  });


  return rows;
})()


),


// Order Summary
React.createElement(
  View,
  { style: styles.summarySection },


  React.createElement(
    View,
    { style: styles.summaryRow },
    React.createElement(Text, { style: styles.summaryLabel }, 'Subtotal:'),
    React.createElement(Text, { style: styles.summaryValue }, `₹${subtotal}`)
  ),


  deliveryCharges > 0 && React.createElement(
    View,
    { style: styles.summaryRow },
    React.createElement(Text, { style: styles.summaryLabel }, 'Delivery Charges:'),
    React.createElement(Text, { style: styles.summaryValue }, `₹${deliveryCharges}`)
  ),


  giftPacking > 0 && React.createElement(
    View,
    { style: styles.summaryRow },
    React.createElement(Text, { style: styles.summaryLabel }, 'Gift Packing:'),
    React.createElement(Text, { style: styles.summaryValue }, `₹${giftPacking}`)
  ),


  promoCode && React.createElement(
    View,
    { style: styles.summaryRow },
    React.createElement(Text, { style: styles.summaryLabel }, 'Promo Code:'),
    React.createElement(Text, { style: styles.summaryValue }, promoCode)
  ),


  promoCodeDiscount > 0 && React.createElement(
    View,
    { style: styles.summaryRow },
    React.createElement(Text, { style: styles.summaryLabel }, 'Promocode Discount:'),
    React.createElement(Text, { style: styles.summaryValue }, `-₹${promoCodeDiscount}`)
  ),


  React.createElement(
  View,
  { style: styles.totalRow },
  React.createElement(Text, { style: styles.totalLabel }, 'TOTAL AMOUNT:'),
  React.createElement(Text, { style: styles.totalValue }, `₹${finalAmount}`)
)
),


     
      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.thankYouText }, 'Thank You for Your Order!'),
        React.createElement(
          View,
          { style: styles.footerText },
          React.createElement(Text, null, 'Follow us on social media for daily fresh updates and special offers!'),
          React.createElement(Text, null, 'Instagram: @bakeflavours | Facebook: Bake Flavours Ahmedabad'),
          React.createElement(Text, null, ''),
          React.createElement(Text, null, 'Terms & Conditions: All orders are subject to availability. Custom orders require 24-48 hours advance notice.'),
          React.createElement(Text, null, 'For any queries, please contact us within 24 hours of delivery.'),
          React.createElement(Text, null, ''),
          React.createElement(Text, null, 'Please rate your experience and share your review!')
        )
      )
    )
  );
};


export default BakeryInvoicePDF;

