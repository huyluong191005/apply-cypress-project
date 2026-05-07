import { formatPrice } from '../../utils/calculations';

const CartSummary = ({ totals, showPromoInput = false, onPromoApply }) => {
  return (
    <div data-cy="cart-summary" className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span data-cy="cart-subtotal" className="font-medium">{formatPrice(totals.subtotal)}</span>
      </div>

      {totals.discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-green-600">-{formatPrice(totals.discount)}</span>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium">
          {totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tax</span>
        <span className="font-medium">{formatPrice(totals.tax)}</span>
      </div>

      <div className="border-t border-gray-200 pt-3 flex justify-between">
        <span className="text-lg font-bold">Total</span>
        <span data-cy="cart-total" className="text-lg font-bold text-primary-600">
          {formatPrice(totals.total)}
        </span>
      </div>

      {totals.subtotal > 0 && totals.subtotal <= 100 && (
        <p className="text-xs text-gray-600 text-center">
          Add {formatPrice(100 - totals.subtotal)} more for FREE shipping!
        </p>
      )}
    </div>
  );
};

export default CartSummary;
