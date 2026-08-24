# Cravora - Food Ordering Website 🍕

This repository hosts the source code for **CRAVORA**, a dynamic food ordering website built using the **MERN Stack**. It provides a user-friendly platform for online food ordering with separate user and admin panels.

## 🚀 Live Application

**Frontend:**
https://cravorafoodee.vercel.app
**Backend API:**
https://cravora-v3nv.onrender.com

---

## ✨ Features

### User Panel

* User Registration and Login
* JWT Authentication
* Password Hashing with Bcrypt
* Browse Food Products
* Filter Food Products
* Add to Cart
* Place Orders
* Stripe Payment Integration
* Order Management
* Logout
* Authenticated APIs
* REST APIs
* Beautiful Alerts

### Admin Panel

* Admin Authentication
* Products Management
* Order Management
* View and Manage Food Items
* Role-Based Identification

---

## 📸 Screenshots

### Hero Section

![Hero](https://i.ibb.co/59cwY75/food-hero.png)

### Products Section

![Products](https://i.ibb.co/JnNQPyQ/food-products.png)

### Cart Page

![Cart](https://i.ibb.co/t2LrQ8p/food-cart.png)

### Login Popup

![Login](https://i.ibb.co/s6PgwkZ/food-login.png)

---

## 🏗️ Project Structure

```text
Cravora/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── admin/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── server.js
    └── package.json
```

---

## ⚙️ Run Locally

### 1. Clone the Project

```bash
git clone https://github.com/vamshikrishna.B/Cravora
```

Go to the project directory:

```bash
cd Cravora
```

---

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 3. Install Admin Dependencies

```bash
cd ../admin
npm install
```

---

### 4. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder:

```env
JWT_SECRET=YOUR_SECRET_TEXT
SALT=YOUR_SALT_VALUE
MONGO_URL=YOUR_DATABASE_URL
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
```

Do not upload your `.env` file or secret API keys to GitHub.

---

## 🔗 Frontend & Backend Configuration

### Frontend

The frontend communicates with the deployed backend:

```javascript
const url = "https://cravora-v3nv.onrender.com";
```

This configuration is located in:

```text
frontend/src/Context/StoreContext.jsx
```

### Admin Panel

The admin panel also communicates with the deployed backend:

```javascript
const url = "https://cravora-v3nv.onrender.com";
```

This configuration is located in:

```text
admin/src/App.jsx
```

### Backend

The backend uses the deployed frontend URL for frontend-related operations such as order/payment redirects:

```javascript
const frontend_url =
  "https://cravorafoodee-mnn97v6j9-vamshikrishna-b.vercel.app";
```

This configuration is used in the backend order controller.

---

## ▶️ Start the Application Locally

### Start Backend

Inside the `backend` folder:

```bash
npm start
```

or during development:

```bash
nodemon server.js
```

### Start Frontend

Inside the `frontend` folder:

```bash
npm start
```

### Start Admin Panel

Inside the `admin` folder:

```bash
npm start
```

---

## 🌐 Deployment

The application is deployed using:

### Frontend

**Vercel**

https://cravorafoodee-mnn97v6j9-vamshikrishna-b.vercel.app

### Backend

**Render**

https://cravora-v3nv.onrender.com

### Database

**MongoDB**

The backend connects to MongoDB using the `MONGO_URL` environment variable.

---

## 🛠️ Tech Stack

* **React** - Frontend
* **Node.js** - Backend runtime
* **Express.js** - Backend framework
* **MongoDB** - Database
* **Stripe** - Payment integration
* **JWT** - Authentication
* **Bcrypt** - Password hashing
* **Multer** - File/image handling
* **REST APIs** - Frontend-backend communication

---

## 🔄 Application Architecture

```text
                    User
                     │
                     ▼
          ┌─────────────────────┐
          │   React Frontend    │
          │       Vercel        │
          └──────────┬──────────┘
                     │
                  REST API
                     │
                     ▼
          ┌─────────────────────┐
          │   Node + Express    │
          │       Render        │
          └──────────┬──────────┘
                     │
            ┌────────┴────────┐
            ▼                 ▼
      MongoDB Database      Stripe
```

---

## 🤝 Contributing

Contributions are always welcome!

If you find an issue or have an improvement, feel free to raise an issue or submit a pull request.
