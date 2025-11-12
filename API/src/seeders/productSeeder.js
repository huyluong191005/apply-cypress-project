import sequelize from '../config/database.js';
import Product from '../models/Product.js';

const categories = {
  'Electronics/Audio': ['Headphones', 'Earbuds', 'Speakers', 'Soundbars'],
  'Electronics/Computers': ['Laptops', 'Monitors', 'Keyboards', 'Mice', 'Webcams'],
  'Electronics/Mobile': ['Smartphones', 'Phone Cases', 'Chargers', 'Screen Protectors'],
  'Electronics/Cameras': ['DSLR Cameras', 'Action Cameras', 'Camera Lenses', 'Tripods'],
  'Electronics/Wearables': ['Smartwatches', 'Fitness Trackers', 'Smart Glasses'],
  'Clothing/Men': ['T-Shirts', 'Jeans', 'Jackets', 'Sneakers', 'Dress Shirts'],
  'Clothing/Women': ['Dresses', 'Blouses', 'Leggings', 'Heels', 'Handbags'],
  'Clothing/Accessories': ['Belts', 'Hats', 'Scarves', 'Sunglasses', 'Watches'],
  'Home & Garden/Furniture': ['Sofas', 'Dining Tables', 'Office Chairs', 'Bed Frames'],
  'Home & Garden/Decor': ['Wall Art', 'Throw Pillows', 'Vases', 'Candles', 'Rugs'],
  'Home & Garden/Kitchen': ['Blenders', 'Coffee Makers', 'Cookware Sets', 'Knives'],
  'Home & Garden/Bedding': ['Bed Sheets', 'Comforters', 'Pillows', 'Blankets'],
  'Sports & Outdoors/Fitness': ['Yoga Mats', 'Dumbbells', 'Resistance Bands', 'Exercise Bikes'],
  'Sports & Outdoors/Camping': ['Tents', 'Sleeping Bags', 'Camping Stoves', 'Backpacks'],
  'Sports & Outdoors/Sports': ['Basketball', 'Soccer Ball', 'Tennis Racket', 'Golf Clubs']
};

const brands = {
  Electronics: ['Sony', 'Samsung', 'Apple', 'Bose', 'JBL', 'Logitech', 'Dell', 'HP', 'Canon', 'Nikon'],
  Clothing: ['Nike', 'Adidas', 'Zara', 'H&M', 'Levi\'s', 'Gap', 'Under Armour', 'Puma'],
  Home: ['IKEA', 'West Elm', 'Pottery Barn', 'KitchenAid', 'Cuisinart', 'Lodge'],
  Sports: ['Nike', 'Adidas', 'Wilson', 'Coleman', 'The North Face', 'Patagonia']
};

const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Navy', 'Brown', 'Beige'];
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const materials = ['Cotton', 'Polyester', 'Leather', 'Stainless Steel', 'Aluminum', 'Plastic', 'Wood'];

// Product name templates
const productNames = {
  'Headphones': ['Wireless Noise-Canceling', 'Premium Over-Ear', 'Studio Pro', 'Bluetooth'],
  'Laptops': ['Pro UltraBook', 'Gaming', 'Business', 'Student'],
  'Smartphones': ['Pro Max', 'Plus', 'Ultra', 'Lite'],
  'T-Shirts': ['Classic Crew Neck', 'V-Neck', 'Long Sleeve', 'Graphic'],
  'Sofas': ['Modern Sectional', 'Classic', 'L-Shaped', 'Sleeper'],
  'Yoga Mats': ['Premium Non-Slip', 'Extra Thick', 'Travel', 'Eco-Friendly']
};

const descriptions = [
  'Experience premium quality with this top-rated product.',
  'Perfect for everyday use, designed with comfort in mind.',
  'Engineered for performance and durability.',
  'A must-have addition to your collection.',
  'Combines style and functionality seamlessly.',
  'Built to last with high-quality materials.',
  'The perfect blend of innovation and design.',
  'Elevate your experience with this exceptional product.'
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomPrice = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const getRandomRating = () => (Math.random() * (5 - 3.5) + 3.5).toFixed(1);

const generateProducts = () => {
  const products = [];
  let productCount = 0;

  for (const [category, items] of Object.entries(categories)) {
    const mainCategory = category.split('/')[0];
    const brandList = brands[mainCategory] || brands.Electronics;

    items.forEach(itemType => {
      // Generate 2-3 products per item type
      const numProducts = getRandomNumber(2, 3);

      for (let i = 0; i < numProducts && productCount < 100; i++) {
        const brand = getRandomElement(brandList);
        const hasDiscount = Math.random() > 0.7; // 30% chance of discount
        const price = parseFloat(getRandomPrice(9.99, 999.99));
        const originalPrice = hasDiscount ? parseFloat((price * 1.2).toFixed(2)) : null;

        // Determine attributes based on category
        const attributes = {};
        if (mainCategory === 'Clothing') {
          attributes.size = getRandomElement(sizes);
          attributes.color = getRandomElement(colors);
          attributes.material = getRandomElement(['Cotton', 'Polyester', 'Leather']);
        } else if (mainCategory === 'Electronics') {
          attributes.color = getRandomElement(['Black', 'White', 'Silver', 'Gray']);
        } else if (mainCategory === 'Home & Garden') {
          attributes.material = getRandomElement(materials);
          attributes.color = getRandomElement(colors);
        }

        const namePrefix = productNames[itemType] ? getRandomElement(productNames[itemType]) : '';
        const productName = namePrefix ? `${brand} ${namePrefix} ${itemType}` : `${brand} ${itemType}`;

        products.push({
          name: productName,
          description: getRandomElement(descriptions),
          price,
          originalPrice,
          currency: 'USD',
          primaryImage: `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(itemType)}`,
          images: [
            `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(itemType)}`,
            `https://placehold.co/400x400/cbd5e1/1e293b?text=${encodeURIComponent(itemType)}+2`,
            `https://placehold.co/400x400/94a3b8/1e293b?text=${encodeURIComponent(itemType)}+3`
          ],
          category,
          brand,
          rating: parseFloat(getRandomRating()),
          reviewCount: getRandomNumber(10, 2500),
          inStock: Math.random() > 0.1, // 90% in stock
          stockCount: getRandomNumber(0, 100),
          attributes,
          featured: Math.random() > 0.8, // 20% featured
          createdAt: new Date(Date.now() - getRandomNumber(0, 90) * 24 * 60 * 60 * 1000) // Random date within last 90 days
        });

        productCount++;
      }
    });
  }

  return products;
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync database (this will create tables)
    await sequelize.sync({ force: true }); // force: true will drop existing tables
    console.log('✓ Database tables created');

    // Generate and insert products
    const products = generateProducts();
    await Product.bulkCreate(products);
    console.log(`✓ Successfully seeded ${products.length} products`);

    // Display statistics
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];
    const inStockCount = products.filter(p => p.inStock).length;
    const featuredCount = products.filter(p => p.featured).length;
    const onSaleCount = products.filter(p => p.originalPrice !== null).length;

    console.log('\n📊 Seeding Statistics:');
    console.log(`   Total Products: ${products.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Brands: ${brands.length}`);
    console.log(`   In Stock: ${inStockCount}`);
    console.log(`   Featured: ${featuredCount}`);
    console.log(`   On Sale: ${onSaleCount}`);
    console.log(`   Price Range: $${Math.min(...products.map(p => p.price)).toFixed(2)} - $${Math.max(...products.map(p => p.price)).toFixed(2)}`);

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
