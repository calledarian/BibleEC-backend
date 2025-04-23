📖 BibleEC Backend – Admin Event Management
This is the backend for the BibleEC website, built using NestJS. It provides secure authentication for the admin and enables full CRUD (Create, Read, Update, Delete) operations for managing event posts through a protected admin panel.

⚙️ Tech Stack

Tool/Technology	Description
NestJS	A progressive Node.js framework used to build efficient and scalable server-side applications.
PostgreSQL	A powerful, open-source relational database system used to store admin credentials and event data.
TypeORM	An ORM (Object-Relational Mapper) to interact with the PostgreSQL database easily.
JWT (JSON Web Tokens)	Used for secure authentication and maintaining user sessions.
Passport.js	Middleware used for implementing authentication strategies, including JWT.
Class-Validator / Class-Transformer	Used for input validation and data transformation in DTOs (Data Transfer Objects).
Dotenv	To manage environment variables for sensitive information like database credentials and JWT secrets.
Helmet + Rate Limiting	Used for basic security hardening (optional but recommended).
🔐 Features
🔑 Admin login with secure password authentication

✅ JWT-based session management

🧾 Protected routes accessible only by authenticated admins

🛠️ CRUD operations for event posts

📦 Modular and scalable folder structure following NestJS best practices