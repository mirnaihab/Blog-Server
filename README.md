# Blog Application

## Overview

The Blog Application is a full-featured blog management system built using Node.js and Express. It allows users to manage posts, comments, roles, and user authentication and authorization. This README provides an overview of the application's features, API endpoints, and usage instructions.

## Features
### Authentication

POST /api/signup: Register a new user.
User Registration: Users can register by providing a username, email, password, and phone number.

POST /api/signin: Log in a user.
User Login: Users can log in using their email and password.

POST /api/forgot-password: Request a password reset.
Forgot Password: Allows users to request a password reset email.

POST /api/reset-password/{token}: Reset the password using a token.
Reset Password: Users can reset their password using a reset token sent to their email.

### User Management

GET /api/users: Retrieve a list of all users.

POST /api/users: Create a new user.

GET /api/users/{id}: Retrieve user details by user ID.

PUT /api/users/{id}: Update user information.

DELETE /api/users/{id}: Delete a user by ID (only if they are not an admin).

### Post Management
POST /api/posts: Create a new blog post with a title and body.

GET /api/posts: Retrieve a list of all posts.

GET /api/posts/{id}: Retrieve a specific post by ID.

PUT /api/posts/{id}: Update a post by ID.

DELETE /api/posts/{id}: Delete a post by ID.

### Comment Management
POST /api/comments/{id}: Add a comment to a specific post.

PUT /api/comments/{id}: Update an existing comment by ID (checks if the current user is the author).

DELETE /api/comments/{id}: Delete a comment by ID (checks if the user is the author or has admin role).

GET /api/comments/: Retrieve a list of all comments.


### Role Management
POST /api/roles: Create new roles.

GET /api/roles:  Retrieve a list of all roles.

GET /api/roles/{id}: Get role by ID.

DELETE /api/roles/{id}: Delete a role by ID.

POST /api/assignRoles/{id}: Assign roles to a user.




## Testing
The project includes unit tests for services using Mocha and Chai. Tests cover the functionality of adding, updating, and deleting comments and posts, as well as user and role management.

## Getting Started

Clone the Repository:

bash

Copy code

git clone https://github.com/your-repo/blog-application.git

### Install Dependencies:

Navigate to the project directory and install the required dependencies.

bash

Copy code

cd blog-application

npm install

### Run the Application:

bash

Copy code

npm start

### Run Tests:

bash

Copy code

npm test

### API Documentation:

Swagger documentation is available at http://localhost:3000/api-docs for local development.

