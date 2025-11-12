// Calculate cart totals
export const calculateCartTotals = (items, promoCode = null) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 15.00) : 0;
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;

  let discount = 0;
  if (promoCode === 'SAVE10') {
    discount = subtotal * 0.10; // 10% off
  } else if (promoCode === 'SAVE20') {
    discount = subtotal * 0.20; // 20% off
  }

  const total = subtotal + shipping + tax - discount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

// Format price
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
