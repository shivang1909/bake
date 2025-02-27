const CODcalculation = (data) => {
    let pendingAmount =0;
    let notSubmmited =0;

    data.forEach((order) => {
        if(order.cod_status === "PENDING") {
            pendingAmount += order.finalOrderTotal;
        } else {
            notSubmmited += order.finalOrderTotal;
        }
    });
    return { pendingAmount, notSubmmited };
    
}

export default CODcalculation;