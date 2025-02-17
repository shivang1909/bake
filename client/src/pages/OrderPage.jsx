import React from "react";
import OrderComponent from "../components/OrderHistory";

const OrderPage = ({ newOrder }) => {
  return (
    <div>
      <OrderComponent newOrder={newOrder} />
    </div>
  );
};

export default OrderPage;
