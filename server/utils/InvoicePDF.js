// utils/InvoicePDF.js (pure JS, no JSX!)
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 10 },
  section: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  bold: { fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid black', marginBottom: 4 },
  tableRow: { flexDirection: 'row', marginBottom: 2 },
  cell: { flex: 1 }
});

const InvoicePDF = ({ order }) =>
  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(Text, { style: styles.title }, 'Bake Flavours'),
      React.createElement(Text, { style: { textAlign: 'center' } }, 'Location: Ahmedabad'),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, null, `Order ID: ${order.orderId}`),
        React.createElement(Text, null, `Order Date: ${new Date(order.createdAt).toLocaleString("en-IN")}`),
        React.createElement(Text, null, `Payment: ${order.payment_status}`),
        React.createElement(Text, null, `Delivery Charges: ₹${order.delivery_charges}`),
        React.createElement(Text, null, `Gift Packing: ₹${order.special_Gift_packing}`)
      ),
      React.createElement(
        View,
        { style: styles.tableHeader },
        React.createElement(Text, { style: [styles.cell, styles.bold] }, 'Product'),
        React.createElement(Text, { style: [styles.cell, styles.bold] }, 'Weight'),
        React.createElement(Text, { style: [styles.cell, styles.bold] }, 'Qty'),
        React.createElement(Text, { style: [styles.cell, styles.bold] }, 'Total')
      ),
      order.products.map((item, i) =>
        item.variantPrices.map((variant, j) =>
          React.createElement(
            View,
            { style: styles.tableRow, key: `${i}-${j}` },
            React.createElement(Text, { style: styles.cell }, item.itemname),
            React.createElement(Text, { style: styles.cell }, variant.weight),
            React.createElement(Text, { style: styles.cell }, variant.quantity),
            React.createElement(Text, { style: styles.cell }, `₹${variant.quantity * variant.price}`)
          )
        )
      ),
      React.createElement(
        View,
        { style: { marginTop: 15, textAlign: 'right' } },
        React.createElement(Text, { style: styles.bold }, `Final Total: ₹${order.finalOrderTotal}`)
      )
    )
  );

export default InvoicePDF;
