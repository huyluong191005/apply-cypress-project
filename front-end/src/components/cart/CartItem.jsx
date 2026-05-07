import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/calculations';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    if (item.quantity < item.product.stockCount) {
      updateQuantity(item.productId, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  return (
    <div data-cy="cart-item" data-product-id={item.productId} className="flex gap-4 py-4 border-b border-gray-200">
      {/* Product Image */}
      <img
        data-cy="cart-item-image"
        src={item.product.primaryImage}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      {/* Product Info */}
      <div className="flex-1">
        <h3 data-cy="cart-item-name" className="font-medium text-gray-900">{item.product.name}</h3>
        <p data-cy="cart-item-price" className="text-sm text-gray-600 mt-1">{formatPrice(item.price)}</p>
        <p data-cy="cart-item-stock" className="text-xs text-gray-500 mt-1">
          Stock: {item.product.stockCount}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            data-cy="quantity-decrease"
            onClick={handleDecrement}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span data-cy="quantity-input" className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            data-cy="quantity-increase"
            onClick={handleIncrement}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            disabled={item.quantity >= item.product.stockCount}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtotal & Remove */}
      <div className="flex flex-col items-end justify-between">
        <p data-cy="cart-item-subtotal" className="font-semibold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </p>
        <button
          data-cy="remove-cart-item"
          onClick={handleRemove}
          className="text-red-600 hover:text-red-700 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
