# Shop Management System

A full-stack **MERN shop management system** built to help shopkeepers manage customers, products, inventory, billing, and payments from a single application.

The application keeps track of customer payment history, automatically calculates bills with taxes and discounts, records paid/unpaid/partial payments, maintains product stock, and generates printable invoices.

## Features

### Customer Management

* Add and manage customer details
* Maintain complete customer payment history
* View previous bills and transactions
* Track outstanding payments

### Billing & Payments

* Create bills with automatic amount calculation
* Apply taxes and discounts
* Automatically calculate the final payable amount
* Record different payment states:

  * Paid
  * Unpaid
  * Partially Paid
* Update payment information for existing bills
* Maintain payment history for each customer

### Product & Stock Management

* Add and manage shop articles/products
* Maintain product prices
* Track available stock
* Automatically keep track of remaining inventory

### Invoice Generation

* Generate professional invoices
* Automatically calculate item totals, taxes, discounts and final amount
* Printable invoice format for customers

### Authentication & Data Isolation

* User registration and login
* Passwords securely hashed using bcrypt
* JWT-based authentication
* Protected API routes
* Each shopkeeper can access only their own customers, products and bills

The application follows a multi-tenant approach where each database record is associated with the authenticated user.

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS3
* CSS animations

### Backend

* Node.js
* Express.js
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv

### Database

* MongoDB
* MongoDB Atlas

### Deployment

* Render
* GitHub

---

## Project Structure

```text
shop-management/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       └── services/
│
└── README.md
```

The backend follows a controller/model/route structure, while the React application handles the user interface and client-side routing.

---

## How It Works

The application is divided into two parts:

```text
React Frontend
      │
      │ Axios / REST API
      ▼
Express + Node.js Backend
      │
      │ Mongoose
      ▼
MongoDB Atlas
```

The frontend communicates with the Express API through Axios. Authentication is handled using JWT, and the token is automatically attached to API requests using an Axios interceptor.

On the backend, protected routes verify the JWT before allowing access to customer, product and billing data.

---

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/gursharndeep01/shopmanneger.git
cd shopmanneger
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

---

## MongoDB Setup

The project uses **MongoDB Atlas** as the cloud database.

Create a MongoDB Atlas cluster and add your connection string to the backend `.env` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shop_management
```

Make sure the required network access and database user are configured in MongoDB Atlas.

---

## Authentication

Authentication is implemented using **JWT (JSON Web Tokens)**.

The basic flow is:

```text
Register / Login
       ↓
Server verifies credentials
       ↓
JWT token generated
       ↓
Token stored on frontend
       ↓
Axios attaches token to requests
       ↓
Backend verifies token
       ↓
Protected resource returned
```

Passwords are hashed using `bcryptjs` before being stored in MongoDB. Protected routes use authentication middleware to verify the JWT.

---

## API Structure

The backend is organized around REST APIs.

Main API groups include:

```text
/api/auth
/api/customers
/api/products
/api/bills
```

The project uses standard HTTP methods for CRUD operations:

```text
GET       → Fetch data
POST      → Create data
PUT       → Update data
PATCH     → Partially update data
DELETE    → Remove data
```

For example, payment information for an existing bill can be updated using a PATCH request instead of replacing the entire bill.

---

## Data Isolation

One important part of the backend is that different shopkeepers cannot access each other's data.

Every major document contains a `userId`:

```js
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
}
```

Database queries are then filtered using the authenticated user's ID:

```js
Customer.find({
    userId: req.user._id
})
```

This allows multiple shopkeepers to use the same application and database while keeping their data separated.

---

## Deployment

The application is deployed using **Render**.

### Backend

```text
Root Directory: backend
Start Command: npm start
```

Environment variables such as `MONGODB_URI`, `JWT_SECRET` and `CLIENT_URL` are configured through Render.

### Frontend

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

The frontend uses the deployed backend API through:

```env
REACT_APP_API_URL=your_backend_api_url/api
```

The frontend also contains a `_redirects` file so that React Router continues to work correctly when a deployed route is refreshed.

---

## Environment Variables

Do not commit `.env` files to GitHub.

Example:

```env
MONGODB_URI=...
PORT=5000
CLIENT_URL=...
JWT_SECRET=...
```

For production, these values are configured through the hosting platform instead of being hardcoded into the application.

---

## Useful Commands

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Git

```bash
git add .
git commit -m "your message"
git push
```

---

## Deployment Notes

A few things are important when deploying the project:

* Keep `.env` out of GitHub.
* Make sure `CLIENT_URL` matches the deployed frontend URL.
* Make sure the frontend points to the deployed backend API.
* Add the React Router `_redirects` file for Render.
* Add `jsonwebtoken` and `bcryptjs` as production dependencies.
* Configure MongoDB Atlas network access correctly.

These were also documented as the main deployment/debugging points in the project guide.

---

## Future Improvements

Some improvements that could be added in future versions:

* Dashboard with sales and revenue analytics
* Low-stock notifications
* PDF invoice download
* Search and filtering for customers and products
* Sales reports by date
* Export reports to Excel/CSV
* Better role-based access control
* Pagination for large datasets
* Redis caching for frequently accessed data

---

## What I Learned From This Project

This project helped me work with a complete full-stack application rather than only building isolated frontend or backend features.

Some of the main concepts involved were:

* Building REST APIs with Express
* Connecting Node.js with MongoDB
* Designing MongoDB schemas with Mongoose
* JWT authentication
* Password hashing with bcrypt
* Protected routes
* React routing
* Axios API integration and interceptors
* CRUD operations
* Managing application state
* Multi-user data isolation
* Environment variables
* Git/GitHub workflow
* Deploying frontend and backend separately

---

## Author

**GursharnDeep Singh**

