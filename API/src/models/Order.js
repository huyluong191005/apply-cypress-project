import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  customerName: {
    type: DataTypes.STRING(255)
  },
  customerEmail: {
    type: DataTypes.STRING(255)
  },
  customerPhone: {
    type: DataTypes.STRING(50)
  },
  shippingAddress: {
    type: DataTypes.TEXT, // JSON object stored as string
    get() {
      const rawValue = this.getDataValue('shippingAddress');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('shippingAddress', JSON.stringify(value));
    }
  },
  billingAddress: {
    type: DataTypes.TEXT, // JSON object stored as string
    get() {
      const rawValue = this.getDataValue('billingAddress');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('billingAddress', JSON.stringify(value));
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2)
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2)
  },
  shipping: {
    type: DataTypes.DECIMAL(10, 2)
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2)
  },
  promoCode: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING(50)
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'confirmed'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  updatedAt: false
});

export default Order;
