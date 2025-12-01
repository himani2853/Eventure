# Eventure - Event Booking System

Eventure is a full-stack event management and booking application designed to provide a seamless experience for users to discover and book events, and for administrators to manage them.

## 🚀 Features

### User Features
*   **Authentication**: Secure User Registration and Login using JWT (JSON Web Tokens).
*   **Event Discovery**: 
    *   Browse upcoming events with a modern, responsive UI.
    *   **Search & Filter**: Find events by title or location.
    *   **Detailed View**: View comprehensive event details including description, date, location, and pricing.
*   **Booking System**:
    *   **Ticket Types**: Choose from various ticket categories (e.g., VIP, General Admission) with real-time availability.
    *   **Checkout Flow**: Specify ticket count, payment method, and special requests.
    *   **Validation**: Prevents booking of past events and enforces ticket limits (max 10 per booking).
    *   **Concurrency Control**: Atomic database updates ensure no overbooking of seats.
*   **User Dashboard**: 
    *   **My Bookings**: View a history of all confirmed bookings with status and total cost.

### Admin Features
*   **Role-Based Access Control (RBAC)**: Secure Admin Dashboard accessible only to users with the 'admin' role.
*   **Event Management**: Create new events with multiple ticket types and capacity settings.
*   **Booking Oversight**: View a comprehensive list of all bookings across the platform.

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)**: Fast and modern UI library.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **React Router**: For client-side routing.
*   **Axios**: For API communication.

### Backend
*   **Node.js & Express**: Robust server-side runtime and framework.
*   **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
*   **JWT (jsonwebtoken)**: For stateless authentication.
*   **Bcryptjs**: For secure password hashing.

## 🧠 Technical Challenges & Solutions

### 1. Concurrency & Overbooking Prevention
**Challenge:** Preventing multiple users from booking the last available seat simultaneously (Race Condition).
**Solution:** Implemented **Atomic Database Operations** using MongoDB's `findOneAndUpdate`. Instead of a traditional "Read-Modify-Write" pattern, we use a query that checks for available seats AND decrements the count in a single atomic transaction.
```javascript
// Atomic check and decrement
await Event.findOneAndUpdate(
  { _id: eventId, 'ticketTypes.availableSeats': { $gte: ticketCount } },
  { $inc: { 'ticketTypes.$.availableSeats': -ticketCount } }
);
```

### 2. Role-Based Access Control (RBAC)
**Challenge:** Securing administrative routes without complicating the codebase.
**Solution:** Designed a modular Middleware architecture. The `verifyToken` middleware handles authentication, while a dedicated `isAdmin` middleware checks for specific role permissions. This allows for easy scalability if new roles (e.g., 'organizer') are added in the future.

### 3. Dynamic Ticket Management
**Challenge:** Events need multiple ticket tiers (VIP, General) with independent stock tracking.
**Solution:** Structured the MongoDB Schema to support an embedded array of `ticketTypes`. The booking logic was engineered to target specific sub-documents within the array for inventory management, ensuring precise tracking for each ticket category.

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js installed.
*   MongoDB installed and running locally (or a cloud URI).

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EventManagementSystem
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/eventure
# OR MongoDB Atlas (Cloud)
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventure

JWT_SECRET=your_super_secret_key_here
# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

### 4. Seed Database (Optional)
Populate the database with test events:
```bash
cd ../server
node seed.js
```

### 5. Run the Application
You need to run both the backend and frontend servers.

**Backend:**
```bash
cd server
npm run dev
```
*Server runs on http://localhost:5000*

**Frontend:**
```bash
cd client
npm run dev
```
*Frontend runs on http://localhost:5173*

## 👮 Admin Setup

To access the Admin Dashboard, you need to promote a user to the 'admin' role.

1.  Register a new user on the frontend (e.g., `admin@example.com`).
2.  Run the admin promotion script from the server directory:
    ```bash
    node scripts/makeAdmin.js admin@example.com
    ```
3.  Log out and log back in to see the **Admin Dashboard** link in the Navbar.

## 🧪 Verification
*   **List Bookings**: Run `node list_bookings.js` in the server directory to see all bookings in the console.
