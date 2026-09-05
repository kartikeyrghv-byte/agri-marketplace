# Farmer to Consumer Agri Marketplace

A full-stack web platform connecting farmers directly with consumers, eliminating middlemen and enabling fair pricing for fresh produce.

**Live Demo**: https://agri-marketplace-teal.vercel.app

## Problem Statement

Traditional agricultural supply chains involve multiple intermediaries, leading to low earnings for farmers and higher prices for consumers. This platform directly connects local farmers with end consumers.

## Features

### Authentication
- Role-based registration and login (Farmer, Consumer, Admin)
- JWT-based secure authentication
- Farmer profile with farm location, crop types, and farming method

### Farmer Features
- Add and manage product listings
- View and update order statuses
- Sales summary dashboard (total orders, revenue, delivered/pending)
- Public farmer profile visible to consumers

### Consumer Features
- Browse products with filters (category, organic, search)
- Place orders with delivery slot selection
- View order history and track status
- Rate and review delivered orders

### Admin Features
- Approve farmer registrations
- Manage products and categories
- Monitor all orders
- Platform commission tracking
- Analytics dashboard (users, products, order trends)

## Tech Stack

**Frontend**: React.js (Vite), React Router, Axios, Tailwind CSS
**Backend**: Node.js, Express.js
**Database**: MongoDB (Mongoose)
**Authentication**: JWT, bcrypt
**Deployment**: Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project Structure

\`\`\`
agri-marketplace/
├── backend/
│   ├── models/       # Mongoose schemas (User, Product, Order, Review, Category)
│   ├── routes/       # API routes (auth, products, orders, admin, reviews)
│   ├── server.js     # Entry point
│   └── .env          # Environment variables (not committed)
├── frontend/
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components (Navbar)
│   │   ├── services/    # API service (axios instance)
│   │   └── App.jsx      # Routes
└── README.md
\`\`\`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/auth/farmer/:id | Get farmer public profile |
| GET | /api/products | Get all products (supports filters) |
| POST | /api/products | Add a new product |
| GET | /api/products/farmer/:id | Get products by farmer |
| POST | /api/orders | Place an order |
| GET | /api/orders/consumer/:id | Get consumer's orders |
| GET | /api/orders/farmer/:id | Get farmer's orders |
| GET | /api/orders/farmer/:id/summary | Get farmer sales summary |
| PUT | /api/orders/:id/status | Update order status |
| POST | /api/reviews | Submit a review |
| GET | /api/reviews/farmer/:id | Get farmer's reviews |
| GET | /api/admin/farmers | Get all farmers (admin) |
| PUT | /api/admin/farmers/:id/approve | Approve a farmer |
| GET | /api/admin/products | Get all products (admin) |
| DELETE | /api/admin/products/:id | Delete a product |
| GET | /api/admin/categories | Get all categories |
| POST | /api/admin/categories | Add a category |
| GET | /api/admin/commission | Platform commission summary |
| GET | /api/admin/analytics | Platform analytics |

## Setup Instructions (Local Development)

### Backend
\`\`\`bash
cd backend
npm install
# Create a .env file with MONGO_URI, JWT_SECRET, PORT
node server.js
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000/api
npm run dev
\`\`\`

## Future Enhancements

- Native mobile applications
- Online payments and subscriptions
- Cold-chain and logistics integrations
- AI-based price recommendations
- Integration with government agri schemes

## Author

Kartikey Rajput — Full Stack Web Development Intern Project