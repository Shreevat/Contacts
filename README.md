# MERN Stack Project

This project started as a Node.js learning exercise and evolved into a full-stack MERN application. The backend is built with Node.js and Express, using MongoDB as the database. The frontend is developed with React, incorporating ShadCN for UI components.

## Features

- RESTful API built with Node.js and Express
- MongoDB as the database
- React frontend with ShadCN for UI components
- Authentication using JWT

## Requirements

Create a `.env` file with the following environment variables:

```
PORT=your_port_here
CONNECTION_STRING=your_mongodb_connection_string_here
ACCESS_TOKEN_SECRET=your_secret_key_here
```

## Installation

### Backend

1. Navigate to the backend folder:
   ```sh
   cd mycontacts-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```

### Frontend

1. Navigate to the frontend folder:
   ```sh
   cd contact-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React application:
   ```sh
   npm run dev
   ```

## Hosting

The backend is connected to MongoDB, which serves as the database. The API can be deployed on platforms like Heroku, Render, or Vercel.



