# Blog Application Backend

## Description

This is the backend for a blog application where users can register and log into their accounts. Users have different roles (`User` and `Admin`) with specific permissions. Users can manage their own posts, while administrators have full control over all posts and users.

### User Roles:
- **User**: Can add, edit, and delete their own posts. Сan edit user data, except for the role (only admin can change the role).
- **Admin**: Can add, edit, and delete any post, as well as manage user accounts (view all users, update user details, register new users, delete users).

## Key Technologies

- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for creating REST APIs
- **CORS**: Cross-origin resource sharing for handling cross-domain requests
- **Mongoose**: ORM for MongoDB
- **Morgan**: HTTP request logger middleware
- **JWT (JSON Web Tokens)**: Used for authentication and securing routes