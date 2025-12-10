File Upload & Download System (React + Express + SQLite3)
📌 1. Project Overview

This is a small full-stack project where users can upload a file from the React frontend, and the Express backend saves it on the server. The file details are also stored in a SQLite3 database. Users can later view the list of uploaded files and download them.

I built this to understand:

How frontend and backend communicate

How file upload works in Express

How to store metadata in SQLite3

How to test APIs using Postman

This project is beginner-friendly and helped me learn end-to-end flow of file handling.

📌 2. How to Run the Project Locally
🖥️ Backend (Express + SQLite3)

Go to the backend folder:

cd backend


Install packages:

npm install


Start backend:

node server.js


It will run at: http://localhost:5000

🎨 Frontend (React)

Go to the frontend folder:

cd frontend


Install packages:

npm install


Start frontend:

npm start


It will run at: http://localhost:3000

📌 3. Testing the APIs in Postman
🔹 1. Upload File (POST)

URL:

http://localhost:5000/upload


Steps in Postman:

Select POST

Go to Body

Choose form-data

Add key:

Key: file

Type: File

Value: choose a file

Click Send

You should get:

File uploaded successfully

🔹 2. Get All Files (GET)

URL:

http://localhost:5000/files


This returns the list of uploaded files with ID, original name, and stored path.

🔹 3. Download File (GET)

URL format:

http://localhost:5000/download/<id>


Example:

http://localhost:5000/download/1


This will download the file from the server.

📌 4. Project Structure
project/
│
├── backend/
│   ├── server.js
│   ├── database.db
│   ├── uploads/
│   └── package.json
│
└── frontend/
    ├── src/
    ├── public/
    └── package.json

📌 5. Tools Used

React → frontend UI

Express.js → backend API

SQLite3 → lightweight database

Multer → file upload middleware

Postman → API testing

📌 6. Notes / Possible Improvements

Add file size limit & file type restrictions

Add user login system

Show file preview on frontend
