import React from "react";
import MyDeliveries from "../components/MyDeliveries";

const DeliveriesPage = ({ filterDelivered }) => {
  return (
    <div>
      <MyDeliveries filterDelivered={filterDelivered} />
    </div>
  );
};

export default DeliveriesPage;
