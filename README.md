# Children's Library Management System

## Project Overview

The Children's Library Management System (CLMS) is a full-stack web application developed for IFQ636 Software Lifecycle Measurement. The system provides an online platform for managing library resources, member accounts, reservations, borrowing activities, and administrative operations.

The application was developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js) and deployed to AWS EC2 using a Continuous Integration and Continuous Deployment (CI/CD) pipeline implemented through GitHub Actions.

---

## Repository

GitHub Repository:

https://github.com/n12668605/children-library-management-system

---

## Test Accounts

### Administrator Account

**Email:** admin@library.com

**Password:** password123

### Member Account

**Email:** member@library.com

**Password:** password123

> These accounts are provided for assignment marking purposes and allow access to both member and administrator functionality.

---

## Public Deployment URL

**Application URL:**  
http://32.236.157.48

---

## Deployment Status

The application is deployed and accessible through AWS EC2. Updates pushed to the GitHub repository are automatically deployed through the GitHub Actions CI/CD pipeline.

---

## Technology Stack

### Frontend
- React.js
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB Atlas
- Mongoose

### DevOps
- GitHub Actions
- AWS EC2
- PM2

---

## Project Setup Instructions

### Clone Repository

```bash
git clone https://github.com/n12668605/children-library-management-system.git
cd children-library-management-system
```

### Backend Setup

Navigate to the backend directory:

```bash
cd childrens-library-backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

Start the backend server:

```bash
npm start
```

### Frontend Setup

Navigate to the frontend directory:

```bash
cd childrens-library-frontend
npm install
npm run dev
```

The frontend application will be available at:

```text
http://localhost:5173
```

---

## System Features

### Guest Features

- Browse library catalogue
- Search books by title and author
- Filter books by category
- Filter books by age range
- View book details

### Member Features

- User registration and login
- Borrow books
- Return books
- View active reservations
- View borrowing history
- View dashboard

### Administrator Features

- Add books
- Edit books
- Delete books
- Manage catalogue records
- Manage member information
- Monitor reservations
- Access administrative dashboard

---

## Repository Structure

```text
children-library-management-system
│
├── childrens-library-backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── childrens-library-frontend
│   ├── public
│   ├── src
│   ├── App.jsx
│   ├── main.jsx
│   └── package.json
│
├── .github
│   └── workflows
│
├── README.md
├── TRACEABILITY.md
└── IFQ636.drawio
```

---

## Database Collections

| Collection | Purpose |
|------------|----------|
| books | Library catalogue records |
| users | User authentication and accounts |
| members | Member information |
| reservations | Book reservation records |

---

## CI/CD Pipeline

GitHub Actions is used to automate the build and deployment process.

The pipeline performs the following activities:

1. Checkout repository source code
2. Configure Node.js environment
3. Install backend dependencies
4. Install frontend dependencies
5. Build React frontend application
6. Deploy application to AWS EC2
7. Restart backend services using PM2

This automated workflow supports Continuous Integration and Continuous Deployment by ensuring application updates are automatically validated and deployed to the production environment.

---

## Deployment

The application is hosted on AWS EC2 and uses PM2 to manage backend processes.

Deployment workflow:

1. Code is pushed to GitHub.
2. GitHub Actions automatically executes the CI/CD pipeline.
3. Application files are deployed to the AWS EC2 server.
4. PM2 restarts the backend service.
5. Updated functionality becomes available through the public deployment URL.

---

## Author

**Ananth Naidu**

IFQ636 – Software Lifecycle Measurement

Queensland University of Technology (QUT)

2026