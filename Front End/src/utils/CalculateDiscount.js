export const calculateDiscount = (originalPrice, discount) => {
    const discountedPrice = originalPrice - originalPrice * (discount / 100);
    return parseFloat(discountedPrice.toFixed(2));
  };
  