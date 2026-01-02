# Todo App Project

A full-stack Todo application built with Node.js, Express, MongoDB, and React Native (Expo).

## Features
- **User Authentication**: Secure login and registration using JWT.
- **CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Task Management**:
  - Filter tasks by status (All, Pending, Completed).
  - Mark tasks as completed/pending.
- **Bonus Features**:
  - **Task Categories**: categorize tasks (General, Work, Personal, Shopping, Study).
  - **Smart Sorting**: Tasks are automatically sorted by Priority (High > Medium > Low), then upcoming deadlines, and finally by creation date.
  - **Visually Appealing UI**: Modern design with color-coded priorities and smooth interactions.

## Tech Stack
### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (using Mongoose)
- **Authentication**: JSON Web Token (JWT) + bcrypt
- **Language**: TypeScript

### Mobile
- **Framework**: React Native (via Expo)
- **Language**: TypeScript/JavaScript
- **Navigation**: React Navigation
- **Networking**: Axios

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or cloud URI)
- Expo Go app on your mobile device (Android/iOS)

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` root with the following variables:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/todoapp
    JWT_SECRET=your_super_secret_key
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

### 2. Mobile App Setup
1.  Navigate to the Expo project directory:
    ```bash
    cd mobile-expo
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Important**: Update the API URL.
    - Open `src/services/api.ts`.
    - Update `API_URL` to your computer's local IP address (e.g., `http://192.168.1.5:5000/api`).
    - *Note: `localhost` will not work on your physical phone.*
4.  Start the Expo server:
    ```bash
    npx expo start
    ```
5.  Scan the QR code printed in the terminal using the **Expo Go** app on your phone.

## Troubleshooting
- **Connection Error**: Ensure your phone and computer are on the **same Wi-Fi network**.
- **MongoDB Error**: Ensure your local MongoDB service is running.
