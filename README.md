# myFlix API

## Overview
The myFlix API provides a backend service for a movie application, offering endpoints for user registration, authentication, and CRUD operations on movie data. This API is built using Node.js and Express, with MongoDB as the database.

## Features
- User registration and authentication (with JWT).
- Secure endpoints protected with Passport.js.
- CRUD operations for movies and users.
- Endpoints to manage user favorite movies.
- Detailed logging using Morgan.
- Input validation with express-validator.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- JSON Web Token (JWT)
- Heroku (for deployment)

## Installation

### Prerequisites
- Node.js (v12 or higher)
- MongoDB
- Git

### Setup
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/myFlixAPI.git
    cd myFlixAPI
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables: Create a `.env` file in the root of the project and add your MongoDB connection string:
    ```plaintext
    CONNECTION_URI=mongodb://your_mongo_uri
    PORT=8080
    JWT_SECRET=your_jwt_secret
    ```

4. Run the application:
    ```sh
    npm start
    ```
    The API will be available at `http://localhost:8080`.

## Deployment
The API is hosted on Heroku. You can access it at:

[https://chavez-flix-movies-79a461fc3127.herokuapp.com/](https://chavez-flix-movies-79a461fc3127.herokuapp.com/)

## Usage

### Authentication
All endpoints (except `/login` and `/users`) require a JWT for access. Include the JWT in the Authorization header as follows:

Authorization: Bearer <your_jwt_token>

## Endpoints

### Root

GET /
Returns a welcome message.

### Movies

GET /movies
Returns a list of all movies.

GET /movies/:title
Returns details of a specific movie by title.

GET /movies/genre/:name
Returns details of a specific genre by name.

GET /movies/director/:name
Returns details of a specific director by name.

### Users

POST /users
Registers a new user.

PUT /users/:username
Updates a user's information.

POST /users/:username/favorites/:movieId
Adds a movie to user's favorites.

DELETE /users/:username/favorites/:movieId
Removes a movie from user's favorites.

DELETE /users/:username
Deregisters an existing user.

## Project Deliverables

Throughout the development process, ensure each step is well-documented to create high-quality deliverables for your professional portfolio. Key deliverables include:

## Project Directory Setup

- Node.js Modules and Syntax Practice
- Package Management with package.json
- Express.js for Routing HTTP Requests
- Defining REST API Endpoints
- Relational Database Setup (SQL)
- Non-Relational Database Setup (MongoDB)
- Business Logic Modeling with Mongoose
- Authentication and Authorization (JWT)
- Data Security, Validation, and Deployment

## Technical Requirements for the Project

- The API must be a Node.js and Express application.
- The API must use REST architecture.
- The API must use at least three middleware modules (e.g., body-parser, morgan).
- The API must use a package.json file.
- The database must be built using MongoDB.
- The business logic must be modeled with Mongoose.
- The API must provide movie information in JSON format.
- The JavaScript code must be error-free.
- The API must be tested in Postman.
- The API must include user authentication and authorization.
- The API must include data validation logic.
- The API must meet data security regulations.
- The API source code must be deployed to GitHub.
- The API must be deployed to Heroku.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

Thanks to the Full-Stack Immersion program tutors for the guidance and support.
