import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, 'database', 'ecommerce.db'),
  logging: false
});

// Define Product model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: DataTypes.STRING,
  stockCount: DataTypes.INTEGER,
  inStock: DataTypes.BOOLEAN
}, {
  tableName: 'products',
  timestamps: false
});

async function resetStock() {
  try {
    // Update all products to have high stock (1000 units) and inStock = true
    const [affectedCount] = await Product.update(
      { stockCount: 1000, inStock: true },
      { where: {} }
    );

    console.log(`Updated ${affectedCount} products to have 1000 units in stock`);

    // Show first 5 products to confirm
    const products = await Product.findAll({ limit: 5 });
    console.log('\nSample products:');
    products.forEach(p => {
      console.log(`  ${p.name}: ${p.stockCount} units (inStock: ${p.inStock})`);
    });

    console.log('\nStock levels reset successfully!');
  } catch (error) {
    console.error('Error resetting stock:', error);
  } finally {
    await sequelize.close();
  }
}

resetStock();
