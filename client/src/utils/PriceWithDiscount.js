export const pricewithDiscount = (price, dis = 1) => {
    const discountAmount = (Number(price) * Number(dis)) / 100;
    const actualPrice = Number(price) - discountAmount;
    return parseFloat(actualPrice.toFixed(2));
};
