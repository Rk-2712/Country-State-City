# Country, State & City Management Application

A full-stack web application designed to manage geographic hierarchies—specifically **Countries, States, and Cities**. The project features a **React** frontend styled with **Bootstrap 5**, a **Node.js/Express** backend, and a **MySQL** database.

---

## 🚀 Features

### Backend & Database
- **Automatic Database & Table Initialization**: On server startup, the database and tables (`countries`, `states`, and `cities`) are automatically created if they do not exist. Columns are updated dynamically if necessary.
- **Database Seeding**: The server automatically seeds the database with initial records (e.g., India, United States, Canada) if the `countries` table is empty.
- **Relational Integrity**: Foreign key constraints are enforced with cascading deletes (`ON DELETE CASCADE`). Deleting a country will automatically clean up its associated states and cities.
- **Robust REST API**: Complete CRUD (Create, Read, Update, Delete) routes for managing countries, states, and cities.

### Frontend (User Interface)
- **Country Management**: Create, read, update, and delete countries. View population, currency, and capital information in a structured list.
- **State Management**: Create, view, edit, and delete states. Includes state-specific capitals and lists the corresponding parent country.
- **Dynamic Country Filtering**: Filter the list of states by country via a dropdown menu.
- **Pagination**: Built-in pagination logic for clean display of larger lists (displays 14 states per page).
- **Responsive Layout**: Designed with clean typography and dark/light components utilizing Bootstrap 5.

---

## 🛠️ Tech Stack

- **Frontend**: React (v19), React Router DOM (v7), Bootstrap (v5.3.7 via CDN)
- **Backend**: Node.js, Express.js (v5)
- **Database**: MySQL (v8+) using the `mysql2` promise-based driver
- **Process Management**: `concurrently` (to run the React client and Node server simultaneously in development) and `nodemon` (for server hot-reload)

---

## 📁 Project Structure

```text
├── client/                 # Frontend React Application
│   ├── public/             # Public assets & HTML template
│   └── src/
│       ├── components/     # Reusable layout components (Header, Footer)
│       ├── pages/          # Page components (Home/Country, State)
│       ├── App.js          # App routing setup
│       └── index.js        # React Entry point
│
├── server/                 # Backend Node/Express Application
│   ├── config/             # DB Connection settings (db.js)
│   ├── models/             # Custom MySQL Database abstraction classes (ORM-like wrapper)
│   ├── routes/             # Express Route handlers
│   ├── .env                # Server Environment configurations
│   └── server.js           # Server Entry point (database setup and listener)
│
├── package.json            # Main workspaces/scripts runner
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MySQL Server** (running locally or remotely)

### 2. Database Configuration
1. Open your MySQL client and ensure you have access to a user account with creation privileges (usually `root`).
2. Navigate to the `server/` directory and locate the `.env` file (or create it if missing).
3. Fill in your MySQL connection credentials:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=country_state_db
   ```
   *Note: The application will automatically create the database specified in `DB_NAME` if it does not already exist.*

### 3. Install Dependencies
At the project root, run the custom install script to install all packages for both the client and server:
```bash
npm run install:all
```

### 4. Running the Application
To run both the server and client concurrently in development mode:
```bash
npm run dev
```
- **React Frontend**: Starts on [http://localhost:3000](http://localhost:3000)
- **Express API Backend**: Starts on [http://localhost:5000](http://localhost:5000)

---

## 🔌 API Reference

### Country Endpoints (`/api/countries`)
- `GET /api/countries` - Retrieve all countries.
- `GET /api/countries/:id` - Retrieve a specific country by ID.
- `POST /api/countries` - Add a new country.
- `PUT /api/countries/:id` - Update country details (capital, currency, population, name).
- `DELETE /api/countries/:id` - Delete a country (cascades delete to states/cities).

### State Endpoints (`/api/states`)
- `GET /api/states` - Retrieve all states (joins country details).
- `GET /api/states/country/:countryId` - Retrieve states belonging to a specific country.
- `POST /api/states` - Add a new state.
- `PUT /api/states/:id` - Update state details.
- `DELETE /api/states/:id` - Delete a state (cascades delete to cities).

### City Endpoints (`/api/cities`)
- `GET /api/cities` - Retrieve all cities (joins state and country details).
- `GET /api/cities/state/:stateId` - Retrieve cities belonging to a specific state.
- `POST /api/cities` - Add a new city.
- `DELETE /api/cities/:id` - Delete a city.

---

## 🗃️ Database Schema

### `countries`
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR, Unique, Not Null)
- `capital` (VARCHAR)
- `currency` (VARCHAR)
- `population` (VARCHAR)
- `createdAt` / `updatedAt` (TIMESTAMP)

### `states`
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR, Not Null)
- `country_id` (INT, Foreign Key referencing `countries(id)` ON DELETE CASCADE)
- `capital` (VARCHAR)
- `createdAt` / `updatedAt` (TIMESTAMP)

### `cities`
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR, Not Null)
- `state_id` (INT, Foreign Key referencing `states(id)` ON DELETE CASCADE)
- `createdAt` / `updatedAt` (TIMESTAMP)
