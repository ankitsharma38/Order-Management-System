# Order Management System

A simple, full-stack Order Management System (OMS) built for an e-commerce application. 
This project allows admins to add products (via API or seed script) and customers to select products, manage their cart, and place orders.

## Features

- **Frontend:** Built with React, Vite, TypeScript, and Tailwind CSS.
- **Backend:** Built with Node.js, Express, TypeScript, and MongoDB.
- **State Management:** Uses React Context API with LocalStorage persistence for the shopping cart.
- **Data Integrity:** The backend uses MongoDB Transactions to ensure stock is updated correctly and orders are not partially saved on failure.
- **Secure Pricing:** The total order price is calculated strictly on the backend to prevent frontend manipulation.
- **Status Management:** Includes API endpoints with validation to update order statuses (e.g., pending -> confirmed -> shipped -> delivered).

## Prerequisites

Make sure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (Local or Atlas URL)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ankitsharma38/Order-Management-System.git
cd Order-Management-System
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Rename `.env.example` to `.env` and provide your MongoDB URI.
- Run the development server:
```bash
npm run dev
```
*(Optional)* To seed the database with mock products:
```bash
node seed_data.js
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
- Rename `.env.example` to `.env`.
- Run the React application:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Testing

A comprehensive end-to-end test script is provided in the backend folder to verify business logic and edge cases.
```bash
cd backend
node test_e2e.js
```
