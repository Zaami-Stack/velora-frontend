# Velora — Ecommerce Project

A full-stack luxury ecommerce store built with React, Node.js, and TiDB Cloud.

## Live URLs

- **Frontend**: https://velora-frontend-one-rosy.vercel.app
- **Backend API**: https://velora-backend-e4ba.onbelmo.uk/api

## Tech Stack

| Layer      | Tech                                       |
| ---------- | ------------------------------------------ |
| Frontend   | React 19, Vite 8, Tailwind CSS 4, React Router 7 |
| Backend    | Node.js, Express 5, JWT auth               |
| Database   | TiDB Cloud (MySQL-compatible)              |
| Deployment | Vercel (frontend), Belmo (backend)         |

## Features

### Storefront
- 40 products across 8 categories (Blazers, Dresses, Tops, Pants, Knitwear, Shoes, Bags, Accessories)
- Product search, category filter, price range, sort (price, rating, newest)
- Color variant system — each color swatch can have its own image
  - Product detail: click a color to swap the main product image
  - Product card: hover a color swatch to preview that variant's image
- Size selection (XS–XL), quantity picker
- Shopping bag with quantity controls, order summary, free shipping over $50
- Wishlist with "Add All to Bag" functionality
- Checkout with saved shipping addresses
- Related products on product detail pages
- Animated carousel on homepage

### User Account
- Email/password registration with security question
- Login with JWT token
- Forgot password flow (email → answer security question → reset)
- Profile editing (name, email, phone)
- Password change
- Order history with cancel capability
- Saved shipping addresses

### Admin Panel
- Dashboard with total orders, revenue, customers, pending orders
- Recent orders table
- Order management — filter by status (pending, processing, shipped, delivered, cancelled)
- Product management — full CRUD with image preview
  - Add/edit products with name, category, price, original price, badge, rating, reviews, description
  - Color variant management — add hex color + image URL per variant
  - Product images with preview
- User management — view all users, order count, total spent
- Admin user detection with access control

### Design & UX
- Clean, minimal luxury aesthetic
- Dark mode support (ThemeContext)
- Responsive across mobile, tablet, desktop
- Toast notifications for all actions
- Loading skeletons and spinners
- Error boundary for crash recovery
- Scroll to top on navigation
- Lazy-loaded routes for performance
- SideNav category drawer on homepage only

## Project Structure

```
├── backend/
│   ├── server.js              # Express app, CORS, health check
│   ├── models/db.js           # MySQL pool, schema init, migrations
│   ├── middleware/
│   │   ├── auth.js            # JWT verify, admin check, register/login/forgot/reset
│   │   └── validate.js        # Request validation rules
│   └── routes/
│       ├── auth.js            # Register, login, profile, password, security questions
│       ├── products.js        # Public product list, categories, detail
│       ├── orders.js          # Create, list, detail, cancel
│       └── admin.js           # Dashboard, orders, products CRUD, users
├── src/
│   ├── api.js                 # API client with JWT headers
│   ├── App.jsx                # Routes and providers
│   ├── components/
│   │   ├── Header.jsx         # Top nav with cart count, menu toggle
│   │   ├── Layout.jsx         # Page wrapper with optional SideNav
│   │   ├── AdminLayout.jsx    # Admin wrapper with top tab nav
│   │   ├── SideNav.jsx        # Category drawer (homepage only)
│   │   ├── ProductCard.jsx    # Product card with color hover preview
│   │   ├── Carousel.jsx       # Homepage hero carousel
│   │   ├── Logo.jsx           # Brand logo
│   │   ├── ErrorBoundary.jsx  # Catch-all error handler
│   │   ├── ProtectedRoute.jsx # Auth + admin guard
│   │   └── ScrollToTop.jsx    # Scroll on route change
│   ├── context/
│   │   ├── AuthContext.jsx    # User state, login/logout/register
│   │   ├── CartContext.jsx    # Cart with localStorage persistence
│   │   ├── WishlistContext.jsx# Wishlist with localStorage persistence
│   │   ├── ToastContext.jsx   # Toast notifications
│   │   └── ThemeContext.jsx   # Dark/light mode toggle
│   └── pages/
│       ├── HomePage.jsx       # Hero carousel, featured products, categories
│       ├── ProductDetailPage.jsx # Product detail with color/size/quantity
│       ├── CartPage.jsx       # Shopping bag
│       ├── CheckoutPage.jsx   # Shipping + order placement
│       ├── WishlistPage.jsx   # Saved items
│       ├── AccountPage.jsx    # Profile, orders, addresses, password
│       ├── LoginPage.jsx      # Email/password login
│       ├── SignUpPage.jsx     # Registration with security question
│       ├── ForgotPasswordPage.jsx # 3-step password reset
│       ├── NotFoundPage.jsx   # 404 page
│       └── admin/
│           ├── DashboardPage.jsx  # Stats + recent orders
│           ├── OrdersPage.jsx     # Order management
│           ├── ProductsPage.jsx   # Product CRUD with color+image
│           └── UsersPage.jsx      # User list
```

## Database Schema

- **users** — id, name, email, password, phone, security_question, security_answer_hash, is_admin, created_at
- **products** — id, name, category, price, original_price, image, badge, rating, reviews, description
- **product_colors** — id, product_id, color_hex, image
- **orders** — id, user_id, subtotal, shipping, total, shipping_address (JSON), status, created_at
- **order_items** — id, order_id, product_id, name, image, price, quantity

## Environment Variables (Backend)

```
PORT=5000
JWT_SECRET=...
DB_HOST=...
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=velora
DB_SSL=true
CORS_ORIGIN=*
```

## Environment Variables (Frontend)

```
VITE_API_URL=https://velora-backend-e4ba.onbelmo.uk/api
```
