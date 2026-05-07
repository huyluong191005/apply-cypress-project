import { useState } from 'react';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import CartSummary from '../cart/CartSummary';
import { formatPrice } from '../../utils/calculations';
import { useCart } from '../../context/CartContext';

const OrderReview = ({ shippingInfo, paymentInfo, onSubmit, onBack, loading }) => {
  const { cart } = useCart();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    onSubmit();
  };

  return (
    <div data-cy="order-review" className="space-y-6">
      <h2 className="text-xl font-bold">Review Your Order</h2>

      {/* Order Items */}
      <div data-cy="review-order-items" className="card">
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex gap-4">
              <img
                src={item.product.primaryImage}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Information */}
      <div data-cy="review-shipping-address" className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Shipping Address</h3>
          <button
            onClick={() => onBack(1)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Edit
          </button>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-900">{shippingInfo.name}</p>
          <p>{shippingInfo.email}</p>
          <p>{shippingInfo.phone}</p>
          <p>{shippingInfo.address}</p>
          {shippingInfo.apartment && <p>{shippingInfo.apartment}</p>}
          <p>
            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
          </p>
          <p>{shippingInfo.country}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div data-cy="payment-method" className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Payment Method</h3>
          <button
            onClick={() => onBack(2)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Edit
          </button>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-900">Credit Card</p>
          <p>****  **** **** {paymentInfo.cardNumber.slice(-4)}</p>
          <p>{paymentInfo.cardholderName}</p>
        </div>
      </div>

      {/* Order Summary */}
      <CartSummary totals={cart.totals} />

      {/* Terms and Conditions */}
      <Checkbox
        data-cy="terms-checkbox"
        id="terms"
        checked={agreedToTerms}
        onChange={(e) => setAgreedToTerms(e.target.checked)}
        label={
          <span className="text-sm">
            I agree to the{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Privacy Policy
            </a>
          </span>
        }
      />

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="button" variant="secondary" onClick={() => onBack(2)}>
          Back
        </Button>
        <Button
          data-cy="place-order-button"
          onClick={handleSubmit}
          disabled={!agreedToTerms || loading}
          className="flex-1"
          size="lg"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
};

export default OrderReview;
