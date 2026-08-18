# 🍕 Pizza Delivery Full-Stack Application

A full-stack pizza delivery web application developed as part of the **Oasis Infobyte Web Development Internship — Level 3 Task**.

The application allows customers to browse pizzas, create customized pizzas, add items to a shopping cart, securely complete checkout using Razorpay test payments, track their orders, and manage their profiles. It also provides an admin dashboard for managing pizzas and inventory.

---

## 📌 Project Overview

The Pizza Delivery application provides a complete online pizza ordering experience.

Customers can:

* Create an account and log in securely
* Browse available pizzas
* View pizza details and prices
* Create customized pizzas using different ingredients
* Add regular and custom pizzas to the cart
* Update quantities or remove items
* Review their order before checkout
* Complete payment using Razorpay test mode
* View their previous orders
* Track the current status of their orders
* Manage their profile
* Log out securely

Administrators can:

* Log in through the admin system
* Manage pizza products
* Manage pizza ingredients and inventory
* Monitor available stock
* Update inventory manually
* Track low-stock items
* Manage order status

---

## 🎯 Objectives

The main objectives of this project were to:

* Build a complete full-stack web application
* Implement frontend and backend communication
* Create RESTful APIs using Node.js and Express.js
* Store application data using PostgreSQL
* Use Prisma ORM for database management
* Implement JWT-based authentication
* Build a custom pizza creation system
* Implement shopping cart functionality
* Integrate Razorpay test payment
* Implement order management and tracking
* Implement inventory management
* Create separate customer and admin functionality
* Provide a responsive and user-friendly interface

---

# ✨ Features

## 👤 Customer Features

### 🔐 Authentication

* User registration with email verification
* User login
* JWT-based authentication
* Protected routes
* Invalid/expired token handling
* Logout functionality
* Forgot password with email verification
* Persistent user information using local storage

### 👤 User Profile

Customers can view:

* Name
* Email
* Account ID
* Profile avatar using the first letter of their name

The profile also provides quick access to:

* My Orders
* Track Order

### 🍕 Pizza Menu

Customers can:

* Browse available pizzas
* View pizza names
* View descriptions
* View prices
* View pizza images
* Add pizzas to the cart

### 🛠️ Custom Pizza Builder

Customers can create their own pizza by selecting:

* Pizza base
* Sauce
* Cheese
* Multiple vegetables

The application calculates the custom pizza price based on the selected ingredients.

### 🛒 Shopping Cart

Customers can:

* Add pizzas to the cart
* Add custom pizzas to the cart
* Increase item quantity
* Decrease item quantity
* Remove items
* View subtotal
* View total number of items
* Continue shopping
* Proceed to checkout

### 💳 Checkout & Payment

The checkout system provides:

* Order summary
* Item quantities
* Subtotal
* Delivery information
* Total amount
* Razorpay test-mode integration
* Payment verification
* Payment success handling
* Payment failure handling
* Payment cancellation handling

### 🧾 Orders

Customers can view their previous orders including:

* Order ID
* Ordered items
* Quantity
* Pizza type
* Custom pizza information
* Total amount
* Current order status

### 📦 Order Tracking

Customers can track their latest order through different stages:

1. Order Received
2. In Kitchen
3. Sent to Delivery
4. Delivered

The tracking page periodically checks for updated order status.

---

# 👨‍💼 Admin Features

The application includes an administrative side for managing the pizza delivery system.

### 📊 Admin Dashboard

Administrators can access a separate dashboard to manage application data.

### 🍕 Pizza Management

Admin functionality includes pizza CRUD operations:

* Create pizza
* View pizzas
* Update pizza
* Delete pizza

### 📦 Inventory Management

Inventory can be managed for:

* Pizza bases
* Sauces
* Cheese
* Vegetables
* Pizza stock

The system checks ingredient availability when customers place orders.

### ⚠️ Low Stock Monitoring

Inventory items have stock and threshold values.

When stock becomes low, the backend can identify low-stock inventory items for administrative monitoring.

### 📉 Automatic Stock Deduction

When an order containing pizzas or custom pizza ingredients is successfully created, the corresponding inventory quantities are reduced.

Database transactions are used when updating multiple ingredients to help maintain consistent inventory data.

---

# 🛠️ Technologies Used

## Frontend

* React.js
* React Router
* JavaScript
* HTML5
* CSS3
* Fetch API
* Local Storage

## Backend

* Node.js
* Express.js
* JavaScript
* JWT Authentication
* REST APIs

## Database

* PostgreSQL
* Prisma ORM

## Payment

* Razorpay Test Mode

## Development Tools

* Visual Studio Code
* Postman
* Git
* GitHub

---

# 🏗️ Project Architecture

The project follows a client-server architecture.

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    │      Browser        │
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌─────────────────────┐
                    │      React.js       │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │  Node.js + Express  │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │    Prisma ORM       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘
```

---

# 📁 Project Structure

```text
WebDev-L3-PizzaDelivery/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── assets/
│   │   └── ...
│   │
│   ├── package-lock.json
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controller/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── screenshots/
│   ├── home.png
│   ├── menu.png
│   ├── custom-pizza.png
│   ├── cart.png
│   ├── checkout.png
│   ├── profile.png
│   ├── orders.png
│   ├── track-order.png
│   ├── login.png
│   └── admin-dashboard.png
│
└── README.md
```

---

# 🗄️ Database

The application uses **PostgreSQL** as the relational database and **Prisma ORM** for database access.

The database contains models for the major application entities, including:

* User
* Pizza
* PizzaBase
* Sauce
* Cheese
* Vegetable
* CustomPizza
* Order
* OrderItem
* Payment

Relationships between these models allow the application to manage users, pizzas, custom pizza ingredients, orders, payments, and inventory.

---

# 🔐 Authentication

Authentication is implemented using **JSON Web Tokens (JWT)**.

After successful login:

1. The backend validates the user's credentials.
2. A JWT is generated.
3. The token is stored on the client.
4. Protected requests send the token through the `Authorization` header.
5. Backend middleware verifies the token.
6. Authenticated users can access protected resources.

Example:

```text
Authorization: Bearer <JWT_TOKEN>
```

Invalid or expired tokens are handled by redirecting the customer to the login flow.

---

# 🛒 Order Flow

The customer ordering process follows this flow:

```text
Browse Menu
     ↓
Select Pizza
     ↓
Add to Cart
     ↓
Review Cart
     ↓
Checkout
     ↓
Create Order
     ↓
Create Razorpay Payment
     ↓
Complete Payment
     ↓
Verify Payment
     ↓
Order Confirmed
     ↓
Track Order
```

For custom pizzas:

```text
Choose Base
     ↓
Choose Sauce
     ↓
Choose Cheese
     ↓
Choose Vegetables
     ↓
Calculate Price
     ↓
Create Custom Pizza
     ↓
Add to Cart
     ↓
Checkout
```

---

# 📦 Order Tracking

Orders progress through the following statuses:

```text
RECEIVED
    ↓
IN_KITCHEN
    ↓
SENT_TO_DELIVERY
    ↓
DELIVERED
```

The customer can view the latest status through the order tracking page.

The tracking page periodically requests the latest order information from the backend so status changes can be displayed without manually refreshing the page.

---

# 💳 Payment

The project uses **Razorpay test mode** for payment processing.

The payment flow is:

```text
Customer
   ↓
Checkout
   ↓
Backend creates order
   ↓
Backend creates Razorpay payment order
   ↓
Razorpay Checkout
   ↓
Customer completes test payment
   ↓
Payment response
   ↓
Backend verifies payment
   ↓
Order marked as successful
```

> **Note:** Razorpay is configured for test/development purposes. No real financial transaction is intended through this project.

---

# 📸 Screenshots

## 🏠 Home Page

![Home Page](WebDev-L3-PizzaDelivery\screenshots\home.png)

The landing page introduces the pizza delivery service and provides navigation to the menu and ordering experience.

---

## 🍕 Pizza Menu

![Pizza Menu](WebDev-L3-PizzaDelivery\screenshots\menu.png)

Customers can browse the available pizza varieties and add pizzas to their cart.

---

## 🛠️ Custom Pizza Builder

![Custom Pizza Builder](WebDev-L3-PizzaDelivery\screenshots\Custom-pizza.png)

Customers can build a custom pizza by selecting their preferred base, sauce, cheese, and vegetables.

---

## 🛒 Shopping Cart

![Shopping Cart](WebDev-L3-PizzaDelivery\screenshots\cart.png)

The cart displays selected pizzas, quantities, subtotal, and the option to proceed to checkout.

---

## 💳 Checkout

![Checkout](WebDev-L3-PizzaDelivery\screenshots\checkout.png)

Customers can review their order and proceed with the Razorpay test payment.

---

## 👤 User Profile

![User Profile](WebDev-L3-PizzaDelivery\screenshots\profile.png)

The profile page displays customer account information and provides access to orders and order tracking.

---

## 🧾 My Orders

![My Orders](WebDev-L3-PizzaDelivery\screenshots\my-order.png)

Customers can view their previous orders and their current status.

---

## 📦 Track Order

![Track Order](WebDev-L3-PizzaDelivery\screenshots\order-traking.png)

Customers can monitor the progress of their latest order.

---

## 🔐 Authentication

![Login](WebDev-L3-PizzaDelivery\screenshots\login.png)

The application provides login and registration functionality with JWT-based authentication.

---

## ⚙️ Admin Dashboard

![Admin Dashboard](WebDev-L3-PizzaDelivery\screenshots\admin-dashboard.png)

Administrators can manage pizzas and monitor inventory from the admin dashboard.

---

# 🚀 Installation and Setup

## 1. Clone the Repository

```bash
git clone https://github.com/gelu1243-max/OIBSIP.git
```

Navigate into the project:

```bash
cd WebDev-L3-PizzaDelivery
```

---

# 💻 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
DATABASE_URL="your_postgresql_database_url"

JWT_SECRET="your_jwt_secret"

RAZORPAY_KEY_ID="your_razorpay_key_id"

RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

> Do not upload your real `.env` file or secret credentials to GitHub.

Run Prisma:

```bash
npx prisma generate
```

If setting up the database for the first time:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

---

# 🌐 Frontend Setup

Open another terminal and navigate to the client:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at the local development URL displayed by Vite.

---

# 🧪 API Testing

Backend APIs were tested during development using **Postman**.

The application includes API functionality for areas such as:

* User registration
* User login
* User profile
* Pizza management
* Pizza base management
* Sauce management
* Cheese management
* Vegetable management
* Custom pizza creation
* Order creation
* User orders
* Payment creation
* Payment verification
* Admin operations

---

# 🔒 Security Considerations

The project includes several basic security practices:

* JWT-based authentication
* Protected backend routes
* Authorization middleware
* Password authentication
* Environment variables for sensitive configuration
* Server-side stock validation
* Database transactions for inventory updates
* Payment verification through the backend

Sensitive credentials should always be stored in environment variables rather than committed to GitHub.

---

# 📱 User Experience

The application was designed to provide a simple ordering flow:

```text
Home
 ↓
Menu
 ↓
Choose Pizza
 ↓
Cart
 ↓
Checkout
 ↓
Payment
 ↓
Order Success
 ↓
Track Order
```

The application also provides navigation between customer profile, orders, tracking, and menu pages.

---

# 🎓 Internship Context

This project was developed as part of the:

**Oasis Infobyte — Web Development Internship**

**Track:** Web Development & Designing

**Level:** Level 3

**Project:** Pizza Delivery Full-Stack Application

The project demonstrates full-stack development skills including frontend development, backend API development, database design, authentication, payment integration, inventory management, and order tracking.

---

# 📚 Learning Outcomes

Through this project, I gained practical experience in:

* Building full-stack applications with React and Node.js
* Designing REST APIs
* Working with Express.js
* Using PostgreSQL with Prisma ORM
* Designing relational database models
* Implementing JWT authentication
* Protecting API routes
* Managing application state
* Building shopping cart functionality
* Creating dynamic custom product functionality
* Integrating payment gateways
* Implementing payment verification
* Managing inventory
* Using database transactions
* Building order tracking functionality
* Working with Git and GitHub
* Testing APIs using Postman
* Structuring a production-style full-stack project

---

# 🔮 Future Improvements

Possible future improvements include:
* Real-time order tracking using WebSockets
* Online delivery address management
* Multiple payment methods
* Customer reviews and ratings
* Coupon and discount functionality
* More advanced admin analytics
* Improved mobile responsiveness
* Order cancellation functionality
* Delivery personnel management
* Production deployment

---

# ⚠️ Disclaimer

This project was developed for educational and internship purposes.

The Razorpay integration uses test mode and should not be considered a production payment implementation.

---

# 👩‍💻 Author

Full Name : **Gelila Abi Shewangizaw**

Web Development Intern — Oasis Infobyte

GitHub: **(https://github.com/gelu1243-max)**

LinkedIn: **http://www.linkedin.com/in/gelila-abi-b27b61403**

---

# ⭐ Acknowledgements

Special thanks to **Oasis Infobyte** for providing the internship opportunity and project requirements that helped me gain practical experience in full-stack web development.

---

## 📌 Project Status

**Completed ✅**

The core customer ordering, custom pizza, cart, checkout, payment, authentication, order management, tracking, and administrative functionality has been implemented.
