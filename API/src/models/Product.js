import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  primaryImage: {
    type: DataTypes.STRING(500)
  },
  images: {
    type: DataTypes.TEXT, // JSON array stored as string
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  },
  category: {
    type: DataTypes.STRING(255)
  },
  brand: {
    type: DataTypes.STRING(100)
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1)
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  stockCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  attributes: {
    type: DataTypes.TEXT, // JSON object stored as string
    get() {
      const rawValue = this.getDataValue('attributes');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('attributes', JSON.stringify(value));
    }
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'products',
  timestamps: true,
  updatedAt: false
});

export default Product;
