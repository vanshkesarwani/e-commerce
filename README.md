# Velura — Luxury E-Commerce Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

> A modern, responsive, high-performance luxury e-commerce web application engineered with the MERN stack. Designed with editorial aesthetics, micro-interactions, full shopping lifecycle (catalog, cart, coupons, checkout, order tracking, returns & replacements), and an executive administrative dashboard.

---

## 🌟 Key Highlights & Features

### 🛍️ Storefront & Customer Experience
- **Editorial Design System**: Deep slate palettes with velvet amber accents, typography hierarchy, glassmorphism, and responsive micro-animations.
- **Dynamic Category Hubs**: Dedicated collections for **Men, Women, Kids, Footwear, Beauty, Accessories**, and **Home & Kitchen**.
- **Interactive Carousel Banners**: Dynamic promotional banners managed directly from the Admin Panel.
- **Product Exploration**: Search filters by keyword, category, price range, and real-time customer ratings and reviews.
- **Product Details**: Multi-angle image galleries, pricing highlights, stock availability, size selectors, and customer review submission.

### 🛒 Cart, Wishlist & Coupon Engine
- **Slide-Over Wishlist Drawer**: Global quick-access favourites drawer and dedicated wishlist page powered by Zustand with persistent local state.
- **Smart Shopping Cart**: Real-time quantity adjustments, free shipping calculation meters, and item selection controls.
- **Coupon System**: Dynamic coupon code validation with percentage discounts, subtotal deductions, and minimum purchase thresholds.

### 📦 Order Lifecycle, Returns & Replacements
- **Checkout Flow**: Multi-step delivery address collection and payment processing simulation (Stripe / Cash on Delivery).
- **Order Tracking**: Detailed purchase breakdown with status badges (`Processing`, `Shipped`, `Delivered`).
- **Return & Replacement Portal**: Dedicated post-delivery service allowing customers to request returns or replacements with reason selection and comment submission, including request cancellation.

### 🔐 Authentication & Security
- **Role-Based Access Control (RBAC)**: Distinct permissions for `user` and `admin` roles.
- **Dual-Token Authentication**: Secure HTTP-only JWT cookies supporting cross-origin deployments (`SameSite=None; Secure`) alongside Bearer authorization headers.
- **Password Recovery**: Secure tokenized password reset workflow with email validation.
- **Protected Routing**: Navigation guards restricting administrative routes to authenticated managers.

### 📊 Executive Admin Dashboard
- **Sales Analytics**: Overview of total revenue, orders count, product catalog metrics, and user registrations.
- **Catalog Management**: Create, edit, and delete products with automatic image upload to Cloudinary.
- **Banner Management**: Upload and control promotional banners for the storefront hero section.
- **Order Management**: Inspect customer shipping information and update fulfillment statuses (`Processing`, `Shipped`, `Delivered`).
- **User Administration**: Inspect registered customers and manage user roles.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3.4, React Router DOM 6, Zustand, Lucide React, React Icons, React Hot Toast, Axios |
| **Backend** | Node.js (ES Modules), Express.js, Mongoose, JSON Web Tokens (JWT), Cookie-Parser, Express-FileUpload |
| **Database** | MongoDB Atlas / Local MongoDB fallback with automatic schema validation |
| **Cloud Storage** | Cloudinary API (secure image upload, storage, and automated asset cleanup) |
| **Build & Tooling** | Vite Rollup manual chunking (Vendor, Utils, Icons code splitting), PostCSS, Autoprefixer |

---

## 📁 Repository Structure

```text
e-commerce/
├── backend/
│   ├── Controllers/          # Business logic controllers (User, Product, Order, Cart, Coupon, Banner, Dashboard)
│   ├── Models/               # Mongoose data schemas (User, Product, Order, Coupon, Banner)
│   ├── Routes/               # Express API endpoints
│   ├── middleware/           # Auth verification (JWT), RBAC (isAdmin), Error handler
│   ├── jwt/                  # Token generation and cross-domain cookie dispatch
│   ├── utils/                # API features, email transporter, auto-seeder
│   ├── .env.example          # Environment variables template
│   ├── index.js              # Application entry point & server configuration
│   └── package.json          # Backend dependencies & scripts
│
├── frontend/
│   ├── public/               # Public assets and favicon
│   ├── src/
│   │   ├── BannerHome/       # Hero banner components & admin banner forms
│   │   ├── Category/         # Category pages (Men, Women, Kids, Footwear, etc.)
│   │   ├── Dashboard/        # Admin management pages & drawers
│   │   ├── Pages/            # Main views (Home, Login, Register, Cart, Wishlist, Profile)
│   │   ├── Product/          # Product creation, details, and catalog listing
│   │   ├── Review/           # Review display and submission forms
│   │   ├── Search/           # Search results and filtering interfaces
│   │   ├── Store/            # Zustand global state (Cart, Wishlist)
│   │   ├── User/             # User address, orders, returns, profile updates
│   │   ├── api/              # Axios instance with centralized baseURL and interceptors
│   │   ├── components/       # Reusable components (Navbar, BottomNav, Footer, Modals)
│   │   ├── context/          # Auth context provider
│   │   ├── App.jsx           # Master route table & layout shell
│   │   └── main.jsx          # React DOM entry point
│   ├── .env.example          # Frontend environment variables template
│   ├── index.html            # HTML shell with OpenGraph and SEO tags
│   ├── vite.config.js        # Vite build optimization with manualChunks
│   └── package.json          # Frontend dependencies & scripts
│
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas account)
- [Cloudinary Account](https://cloudinary.com/) (Free tier for media uploads)

---

### 1. Clone the Repository
```bash
git clone https://github.com/vanshkesarwani/e-commerce.git
cd e-commerce
```

---

### 2. Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from the template:
   ```bash
   cp .env.example .env
   ```
4. Fill in your environment variables in `backend/.env`:
   ```env
   PORT=3900
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET_KEY=your_jwt_secret_key_here
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_SECRET_KEY=your_cloudinary_secret_key
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will launch on `http://localhost:3900` with automated database connection and health check routes at `/` and `/api/health`.*

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from the template:
   ```bash
   cp .env.example .env
   ```
4. Configure `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3900/api
   ```
5. Launch the frontend development server:
   ```bash
   npm run dev
   ```
   *The web application will open on `http://localhost:5173`.*

---

## 📡 API Reference Overview

### Authentication & Users (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Register a new user | No |
| `POST` | `/login` | Authenticate user & issue JWT cookie | No |
| `GET` | `/logout` | Invalidate session & clear cookie | No |
| `GET` | `/my-profile` | Fetch authenticated user profile | Yes |
| `PUT` | `/update-profile` | Update profile information & avatar | Yes |
| `POST` | `/password/forgot` | Request password reset token | No |
| `PUT` | `/password/reset/:token` | Reset password using verified token | No |
| `GET` | `/admin/allusers` | Fetch all registered accounts | Yes (Admin) |

### Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/getallproducts` | Fetch all products with pagination & filtering | No |
| `GET` | `/getsingleproduct/:id` | Fetch detailed product data by ID | No |
| `GET` | `/search` | Query products by name, category, or tags | No |
| `POST` | `/create/new` | Create a new product with image upload | Yes (Admin) |
| `PUT` | `/updateproduct/:id` | Update product information or stock | Yes (Admin) |
| `DELETE` | `/delete/:id` | Delete product and associated Cloudinary asset | Yes (Admin) |
| `PUT` | `/createreview` | Submit product review & rating | Yes |

### Orders & Returns (`/api/order`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/new` | Place a new order | Yes |
| `GET` | `/:id` | Fetch order details by ID | Yes |
| `GET` | `/me/:userId` | Fetch order history for a specific customer | Yes |
| `POST` | `/return/:id` | Request return or replacement with reason | Yes |
| `POST` | `/return/cancel/:id` | Cancel an active return or replacement request | Yes |
| `GET` | `/admin/orders` | Fetch all orders across the platform | Yes (Admin) |
| `PUT` | `/update/:id` | Update order fulfillment status | Yes (Admin) |
| `DELETE` | `/delete/:id` | Delete order record | Yes (Admin) |

### Banners (`/api/banner`) & Coupons (`/api/coupon`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/banner/all` | Fetch all active promotional banners | No |
| `POST` | `/banner/create` | Upload a new promotional banner | Yes (Admin) |
| `DELETE` | `/banner/delete/:id` | Remove a promotional banner | Yes (Admin) |
| `POST` | `/coupon/apply` | Validate coupon code and calculate discount | Yes |

---

## 🚢 Production Deployment

### Frontend (e.g. Vercel, Netlify)
1. Set the root directory to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`

### Backend (e.g. Render, Railway)
1. Set the root directory to `backend`.
2. Build command: `npm install`
3. Start command: `npm start` (or `node index.js`)
4. Configure all environment variables matching `backend/.env.example`, including:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-domain.com`

---

## 👤 Author

**Vansh Kumar Kesarwani**
- **GitHub**: [@vanshkesarwani](https://github.com/vanshkesarwani)
- **Email**: [vanshkesarwanivk02@gmail.com](mailto:vanshkesarwanivk02@gmail.com)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
