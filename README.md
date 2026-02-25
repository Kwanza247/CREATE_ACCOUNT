# User Account Management API

## Overview
This project is a robust backend API built with Node.js and Express, designed for secure user account management. It leverages Mongoose for elegant MongoDB interactions, implements secure authentication using JSON Web Tokens (JWT) and bcrypt for password hashing, and supports role-based access control.

## Features
- **Node.js**: Asynchronous event-driven JavaScript runtime for scalable network applications.
- **Express.js**: Fast, unopinionated, minimalist web framework for building APIs.
- **Mongoose**: MongoDB object data modeling (ODM) library, providing a straight-forward, schema-based solution for application data.
- **MongoDB**: A flexible NoSQL document database used for storing user data.
- **Bcrypt**: A library for hashing passwords, ensuring secure storage and comparison of user credentials.
- **JSON Web Tokens (JWT)**: Used for secure and stateless authentication and authorization.
- **Dotenv**: Manages environment variables for secure configuration.
- **Role-Based Access Control (RBAC)**: Users can be assigned roles (`imputer`, `authorizer`, `super admin`) for differentiated access.
- **User Status Management**: Users can have `pending`, `approved`, or `rejected` statuses.

## Getting Started

### Installation
To set up and run this project locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Kwanza247/CREATE_ACCOUNT.git
    cd CREATE_ACCOUNT
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Application**:
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file or default to `2001`.

### Environment Variables
Create a `.env` file in the root directory of the project and add the following required environment variables:

```
PORT=2001
CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/<databaseName>?retryWrites=true&w=majority
JWT_SECRET=YourSuperSecretJwtKey
```

**Examples:**
- `PORT`: `3000`
- `CONNECTION_STRING`: `mongodb+srv://dokugen:password123@cluster.mongodb.net/useraccounts?retryWrites=true&w=majority`
- `JWT_SECRET`: `c0mPl3xS3cR3tK3yF0rJwT`

## API Documentation

### Base URL
`http://localhost:<PORT>/api/users`

### Endpoints

#### POST /register
Registers a new user account.

**Request**:
```json
{
  "email": "string",         // Required, must be unique
  "password": "string",      // Required, plain text password
  "phoneNumber": "string",   // Required, must be unique
  "fullName": "string",      // Required
  "role": "string"           // Optional, valid values: "imputer", "authorizer", "super admin"
}
```

**Response**:
```json
{
  "message": "Account created successfully for new.user@example.com",
  "user": {
    "email": "new.user@example.com",
    "phoneNumber": "08012345678",
    "fullName": "New User"
  }
}
```

**Errors**:
- `400 Bad Request`: User already exists (email or phone number is already registered).
- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /login
Authenticates a user and returns a JWT token.

**Request**:
```json
{
  "email": "string",         // Required
  "password": "string"       // Required
}
```

**Response**:
```json
{
  "message": "Login successful for existing.user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzU0N2UzMDliNjA1ZGI2ZWE1YTU3YiIsImVtYWlsIjoiZXhpc3RpbmcudXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTY3ODg5MDcwOSwiZXhwIjoxNjc4ODk0MzA5fQ.signature",
  "role": "imputer",
  "fullName": "Existing User"
}
```

**Errors**:
- `400 Bad Request`: Invalid email or password, or incorrect password.
- `500 Internal Server Error`: An unexpected server error occurred.

#### GET /
Fetches a list of all users, with an option to filter by status. Requires authentication.

**Request**:
Requires `Authorization` header with a Bearer Token.

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters (Optional)**:
- `status`: Filters users by their status. Valid values: `approved`, `pending`, `rejected`.

**Response**:
```json
{
  "message": "Users fetched successfully",
  "users": [
    {
      "_id": "65c547e309b605db6ea5a57b",
      "email": "user1@example.com",
      "phoneNumber": "08011111111",
      "fullName": "User One",
      "status": "approved",
      "role": "imputer",
      "createdAt": "2024-02-08T10:30:00.000Z",
      "updatedAt": "2024-02-08T10:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "65c547e309b605db6ea5a57c",
      "email": "user2@example.com",
      "phoneNumber": "08022222222",
      "fullName": "User Two",
      "status": "pending",
      "role": "authorizer",
      "createdAt": "2024-02-08T11:00:00.000Z",
      "updatedAt": "2024-02-08T11:00:00.000Z",
      "__v": 0
    }
  ]
}
```

**Errors**:
- `401 Unauthorized`: No authentication token provided or the token is invalid.
- `400 Bad Request`: If an invalid `status` query parameter value is provided.
- `500 Internal Server Error`: An unexpected server error occurred.

## Technologies Used

| Technology    | Description                                       | Link                                                                      |
| :------------ | :------------------------------------------------ | :------------------------------------------------------------------------ |
| **Node.js**   | JavaScript runtime built on Chrome's V8 engine.   | [nodejs.org](https://nodejs.org/)                                         |
| **Express.js**| Minimalist web framework for Node.js.             | [expressjs.com](https://expressjs.com/)                                   |
| **MongoDB**   | NoSQL database.                                   | [mongodb.com](https://www.mongodb.com/)                                   |
| **Mongoose**  | MongoDB object modeling for Node.js.              | [mongoosejs.com](https://mongoosejs.com/)                                 |
| **Bcrypt**    | Library for hashing passwords.                    | [npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt)          |
| **JWT**       | JSON Web Token implementation for authentication. | [npmjs.com/package/jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)|
| **Dotenv**    | Loads environment variables from a `.env` file.   | [npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv)          |
| **Nodemon**   | Utility that monitors changes and restarts server. | [nodemon.io](https://nodemon.io/)                                         |

## Contributing
We welcome contributions to enhance this project! To contribute:

*   Fork the repository.
*   Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`.
*   Make your changes and ensure they adhere to the project's coding standards.
*   Commit your changes: `git commit -m 'feat: Add new feature'`.
*   Push to your branch: `git push origin feature/your-feature-name`.
*   Open a pull request describing your changes.

## Author Info

**[Your Full Name]**

*   **LinkedIn**: [https://www.linkedin.com/in/your-linkedin-profile](https://www.linkedin.com/in/your-linkedin-profile)
*   **X (formerly Twitter)**: [https://twitter.com/your_twitter_handle](https://twitter.com/your_twitter_handle)

---

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Bcrypt](https://img.shields.io/badge/Bcrypt-grey?style=for-the-badge)](https://www.npmjs.com/package/bcrypt)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)