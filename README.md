# Law Firm Web Application

A web application for the legal office of Abdelmoneim Abou El Soud El Sayed. It includes a public landing page with SEO optimization, a consultation request form, a client portal to track consultation status, and an administrative dashboard to manage requests.

## Project Structure

This project is organized as a monorepo:
* **client/**: React SPA built with Vite, TypeScript, and CSS.
* **server/**: Express API built with TypeScript and Mongoose.
* **vercel.json**: Configuration for unified Vercel deployment.

## Tech Stack

### Frontend
* React
* React Router DOM for client-side routing
* TypeScript
* CSS

### Backend
* Node.js and Express
* Mongoose and MongoDB (Atlas)
* JWT for administrator authentication
* TypeScript

## Environment Setup

You need to configure the environment variables before running the application.

### Server Configuration (`server/.env`)
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
MONGO_URI_LOCAL=mongodb://127.0.0.1:27017/hola_law_firm
ADMIN_USER=admin_username
ADMIN_PASS=admin_password
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

*Note: If `MONGO_URI` is provided, the server connects directly to it. If it fails, the server exits immediately instead of falling back to the local database.*

### Client Configuration (`client/.env`)
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Local Development

### 1. Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Client
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Production Build

### Unified Server Setup
To run the application locally in production mode where the Express server hosts the React client:
1. Build the React frontend:
   ```bash
   cd client
   ```
   ```bash
   npm run build
   ```
2. Build the backend server:
   ```bash
   cd ../server
   ```
   ```bash
   npm run build
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
The server will now serve the React frontend assets at `http://localhost:5000/`.

---

## Deployment to Vercel

The project is pre-configured for Vercel. 

### Deployment Steps
1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in Vercel.
3. Configure the following environment variables in the Vercel Dashboard project settings:
   * `MONGO_URI`
   * `ADMIN_USER`
   * `ADMIN_PASS`
   * `JWT_SECRET`
4. Deploy. Vercel automatically compiles the client and routes all requests appropriately.
