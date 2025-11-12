# E-commerce Platform - Technical Specification

## Project Overview
Full-stack e-commerce application with React frontend and Node.js/Express backend using SQLite database.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 18+ with Vite 5+
- **Routing**: React Router v6
- **State Management**: Context API + useReducer for cart
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Database**: SQLite3
- **ORM**: Sequelize
- **CORS**: Enabled for local development
- **Port**: 3001 (API), 5173 (Frontend)

## Project Structure

```
/home/user/ecom-react/
├── API/                          # Backend application
│   ├── src/
│   │   ├── models/               # Sequelize models
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   └── OrderItem.js
│   │   ├── routes/               # API routes
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   └── cart.js
│   │   ├── controllers/          # Business logic
│   │   │   ├── productController.js
│   │   │   └── orderController.js
│   │   ├── middleware/           # Express middleware
│   │   │   └── errorHandler.js
│   │   ├── config/               # Configuration
│   │   │   └── database.js
│   │   ├── seeders/              # Database seeders
│   │   │   └── productSeeder.js
│   │   └── server.js             # Entry point
│   ├── database/
│   │   └── ecommerce.db          # SQLite database file
│   ├── package.json
│   └── .gitignore
│
└── front-end/                    # Frontend application
    ├── src/
    │   ├── components/
    │   │   ├── cart/
    │   │   │   ├── CartDrawer.jsx
    │   │   │   ├── CartItem.jsx
    │   │   │   └── CartSummary.jsx
    │   │   ├── checkout/
    │   │   │   ├── ShippingForm.jsx
    │   │   │   ├── PaymentForm.jsx
    │   │   │   ├── OrderReview.jsx
    │   │   │   └── CheckoutProgress.jsx
    │   │   ├── products/
    │   │   │   ├── ProductCard.jsx
    │   │   │   ├── ProductGrid.jsx
    │   │   │   ├── FilterSidebar.jsx
    │   │   │   ├── ActiveFilters.jsx
    │   │   │   ├── SortDropdown.jsx
    │   │   │   └── SearchBar.jsx
    │   │   ├── layout/
    │   │   │   ├── Header.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   └── Layout.jsx
    │   │   └── ui/
    │   │       ├── Button.jsx
    │   │       ├── Input.jsx
    │   │       ├── Slider.jsx
    │   │       ├── Checkbox.jsx
    │   │       ├── Modal.jsx
    │   │       └── Toast.jsx
    │   ├── context/
    │   │   └── CartContext.jsx
    │   ├── hooks/
    │   │   ├── useCart.js
    │   │   ├── useProducts.js
    │   │   └── useFilters.js
    │   ├── pages/
    │   │   ├── ProductListPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   └── OrderConfirmationPage.jsx
    │   ├── utils/
    │   │   ├── calculations.js
    │   │   ├── validation.js
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── .gitignore
```

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  originalPrice DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  primaryImage VARCHAR(500),
  images TEXT, -- JSON array
  category VARCHAR(255),
  brand VARCHAR(100),
  rating DECIMAL(2,1),
  reviewCount INTEGER DEFAULT 0,
  inStock BOOLEAN DEFAULT 1,
  stockCount INTEGER DEFAULT 0,
  attributes TEXT, -- JSON object
  featured BOOLEAN DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId VARCHAR(50) UNIQUE NOT NULL,
  customerName VARCHAR(255),
  customerEmail VARCHAR(255),
  customerPhone VARCHAR(50),
  shippingAddress TEXT, -- JSON object
  billingAddress TEXT, -- JSON object
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  shipping DECIMAL(10,2),
  discount DECIMAL(10,2),
  total DECIMAL(10,2),
  promoCode VARCHAR(50),
  paymentMethod VARCHAR(50),
  status VARCHAR(50) DEFAULT 'confirmed',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### OrderItems Table
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId INTEGER,
  productId INTEGER,
  productName VARCHAR(255),
  quantity INTEGER,
  price DECIMAL(10,2),
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

## API Endpoints

### Products
- `GET /api/products` - Get all products with filtering, sorting, search
  - Query params: category, brand, minPrice, maxPrice, minRating, inStock, search, sortBy, page, limit
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order details

### Categories & Brands (derived)
- `GET /api/filters/categories` - Get all unique categories
- `GET /api/filters/brands` - Get all unique brands

## Frontend Routes

- `/` - Product listing page
- `/checkout` - Checkout flow
- `/confirmation/:orderId` - Order confirmation

## State Management

### Cart Context State
```javascript
{
  items: [
    {
      productId: number,
      product: Product,
      quantity: number,
      price: number
    }
  ],
  subtotal: number,
  tax: number,
  shipping: number,
  discount: number,
  promoCode: string,
  total: number
}
```

### Cart Actions
- `ADD_TO_CART`
- `REMOVE_FROM_CART`
- `UPDATE_QUANTITY`
- `APPLY_PROMO_CODE`
- `CLEAR_CART`

## Data Seeding

Generate 100 mock products across categories:
- Electronics (30): Headphones, Laptops, Phones, Cameras, Watches
- Clothing (25): Shirts, Pants, Dresses, Shoes, Accessories
- Home & Garden (25): Furniture, Decor, Kitchen, Bedding
- Sports & Outdoors (20): Fitness, Camping, Sports Equipment

Brands: 15-20 different brands
Price range: $9.99 - $999.99
Ratings: 1.0 - 5.0

## Development Workflow

1. **Backend First**
   - Set up Express server
   - Configure Sequelize with SQLite
   - Create models
   - Seed database
   - Implement API endpoints
   - Test with Postman/curl

2. **Frontend Second**
   - Set up Vite + React
   - Configure Tailwind CSS
   - Build layout components
   - Implement product listing with filters
   - Build cart functionality
   - Implement checkout flow
   - Add responsive design

3. **Integration**
   - Connect frontend to backend API
   - Test full user flows
   - Handle edge cases
   - Optimize performance

## Running the Application

### Backend
```bash
cd API
npm install
npm run seed  # Seed database
npm start     # Start on port 3001
```

### Frontend
```bash
cd front-end
npm install
npm run dev   # Start on port 5173
```

## Key Features Implementation

### Filtering
- Multi-select filters with AND logic
- URL state persistence
- Real-time filtering (debounced API calls)
- Product count per filter option

### Cart
- localStorage persistence
- Optimistic UI updates
- Stock validation
- Promo code support (hardcoded: SAVE10 = 10% off)

### Checkout
- Form validation with error messages
- Progress indicator
- Back navigation
- Order summary sidebar
- localStorage persistence during checkout

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px
- Collapsible filter sidebar on mobile
- Touch-friendly interactions

## Performance Optimizations

- Lazy loading images
- Debounced search/filter
- React.memo for expensive components
- Code splitting by route
- Pagination (20 products per page)

## Error Handling

- API error responses
- Form validation errors
- Network error handling
- Empty states
- Loading states
- Toast notifications for user feedback

## Next Steps After MVP

1. Run both servers
2. Test all user flows
3. Verify responsive design
4. Check console for errors
5. Test edge cases
6. Performance audit

---

**Document Status**: Ready for Implementation
**Estimated Time**: 3-4 hours for full implementation
