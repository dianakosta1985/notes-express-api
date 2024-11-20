# Notes API

This project is a RESTful API designed to manage user accounts and notes. The API supports basic CRUD operations on notes, user authentication, and search functionality. It includes rate limiting and request throttling mechanisms to handle high traffic and utilizes secure authentication protocols. Swagger is used for API documentation.

## Table of Contents

- [Project Description](#project-description)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Note Endpoints](#note-endpoints)
- [Swagger API Documentation](#swagger-api-documentation)
- [Evaluation Criteria](#evaluation-criteria)
- [Installation](#installation)
- [Testing](#testing)
- [License](#license)

## Project Description

This RESTful API provides an interface for users to manage their notes. It allows users to sign up, log in, create, read, update, delete, and search their notes. The API also implements security through token-based authentication, and performance is optimized through rate limiting and request throttling.

## Technologies Used

- **Backend Framework**: Express.js (Node.js)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Rate Limiting**: `express-rate-limit`
- **Search Functionality**: MongoDB text indexing for high-performance keyword search
- **Testing**: Jest, Supertest
- **Security**: Bcrypt for password hashing
- **API Documentation**: Swagger

## API Endpoints

### Authentication Endpoints

- **POST** `/api/auth/signup`: Create a new user account.
  - Request body: `{ email: String, password: String }`
  - Response: `{ message: String, userId: String }`
- **POST** `/api/auth/login`: Log in to an existing user account and receive an access token.
  - Request body: `{ email: String, password: String }`
  - Response: `{ token: String }`

### Note Endpoints

- **GET** `/api/notes`: Get a list of all notes for the authenticated user.
  - Response: `[ { id: String, title: String, description: String, createdAt: Date, updatedAt: Date } ]`
- **GET** `/api/notes/:id`: Get a note by ID for the authenticated user.
  - Response: `{ id: String, title: String, description: String, createdAt: Date, updatedAt: Date }`
- **POST** `/api/notes`: Create a new note for the authenticated user.
  - Request body: `{ title: String, description: String }`
  - Response: `{ id: String, title: String, description: String }`
- **PUT** `/api/notes/:id`: Update an existing note by ID for the authenticated user.

  - Request body: `{ title: String, description: String }`
  - Response: `{ id: String, title: String, description: String }`

- **DELETE** `/api/notes/:id`: Delete a note by ID for the authenticated user.
  - Response: `{ message: String }`
- **POST** `/api/notes/:id/share`: Share a note with another user for the authenticated user.
  - Request body: `{ email: String }`
  - Response: `{ message: String }`
- **GET** `/api/search?q=:query`: Search for notes based on keywords for the authenticated user.
  - Response: `[ { id: String, title: String, description: String, createdAt: Date, updatedAt: Date } ]`

## Swagger API Documentation

To explore and test the API using Swagger UI, you can access the Swagger documentation in the browser after starting the server:

- **Swagger Docs URL**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

The Swagger UI will display all the available endpoints, request/response formats, and allow you to make API requests directly from the documentation.

### How to Use Swagger Documentation:

1. **Run the Server**: Start the server by running `npm start`.
2. **Open Swagger UI**: Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) in your browser.
3. **Test the Endpoints**: Use the interactive UI to send requests to the API, view the responses, and test different functionalities.

## Evaluation Criteria

Your code will be evaluated on the following criteria:

- **Correctness**: Does the code meet the requirements and work as expected?
- **Performance**: Does the code use rate limiting and request throttling to handle high traffic?
- **Security**: Does the code implement secure authentication and authorization mechanisms?
- **Quality**: Is the code well-organized, maintainable, and easy to understand?
- **Completeness**: Does the code include unit, integration, and end-to-end tests for all endpoints?
- **Search Functionality**: Does the code implement text indexing and search functionality to enable users to search for notes based on keywords?

## Installation

To get started with the project locally:

1. Clone the repository:
   ```bash
   git clone git@github.com:dianakosta1985/notes-express-api.git
   ```
2. Install the dependencies:

bash
Copy code

```bash
npm install
```

### Set up your MongoDB connection:

Make sure you have MongoDB installed and running locally or use a MongoDB Atlas cluster.
Create a .env file with the following variables:

makefile
Copy code

```bash
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret-key
PORT=5000
```

### Run the server:

```bash
npm start
```

### Testing

Run the unit and integration tests:

```bash
   npx jest --runInBand
```

Tests are located in the tests/ folder. Use Jest for unit testing and integration testing, with Supertest for HTTP assertions.

### In this version:

- The **Installation** and **Testing** sections are properly formatted with markdown, making the instructions clear.
- I’ve fixed the formatting, so the commands and explanations are more readable and properly presented.

Let me know if you need further changes!
