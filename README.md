# 📚 Bookmate Backend

A modern **RESTful API** built with **Express**, **TypeScript**, and **Mongoose** for managing books and borrow records in a library system.  
This backend is cleanly structured, developer-friendly, and ready for production use.

---

## 🚀 Features

- 📖 **Book Management** — Add, view, update, and delete books  
- 👤 **Borrow System** — Borrow books and get a borrow summary  
- ⚙️ **TypeScript-Powered** — Type safety across the entire codebase  
- 🗄 **MongoDB Integration** — Reliable and scalable data storage  
- 🧩 **Modular Architecture** — Clean folder structure for controllers, routes, and middleware  
- 💬 **Centralized Error Handling** — User-friendly error responses  
- ✅ **Request Validation** — Optional request validation middleware for cleaner input

---

## 🏗 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Node.js + Express** | Web framework for building APIs |
| **TypeScript** | Strongly typed JavaScript for scalability |
| **MongoDB + Mongoose** | Database and ODM for modeling data |
| **dotenv** | Environment variable management |

---

## 📂 Project Structure

```
┣ 📂src
┃ ┣ 📂controllers
┃ ┃ ┣ 📜book.controller.ts
┃ ┃ ┗ 📜borrow.controller.ts
┃ ┣ 📂middlewares
┃ ┃ ┣ 📜errorHandler.ts
┃ ┃ ┗ 📜validateRequest.ts
┃ ┣ 📂models
┃ ┃ ┣ 📜book.model.ts
┃ ┃ ┗ 📜borrow.model.ts
┃ ┣ 📂routes
┃ ┃ ┣ 📜book.routes.ts
┃ ┃ ┗ 📜borrow.routes.ts
┃ ┣ 📂utilities
┃ ┃ ┗ 📜apiFeatures.ts
┃ ┣ 📜app.ts
┃ ┗ 📜index.ts
┣ 📜.env
┣ 📜.gitignore
┣ 📜package.json
┗ 📜tsconfig.json

```


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```
git clone https://github.com/yourusername/library-backend.git
cd library-backend
```

### 2️⃣ Install dependencies
 ```
npm install
```
### 3️⃣ Create a .env file
 ```
PORT=4000
MONGO_URI=mongodb://localhost:27017/library
```
### 4️⃣ Run the server in development
 ```
npm run dev
```
### 5️⃣ Build for production
 ```
npm run build
npm start
```

--- 

## 🔗 API Endpoints
### 📘 Books

| Method | Endpoint | Description |
|-------------|----------|----------|
| **GET** | /api/books | Get all books |
| **GET** | /api/books/:id | Get a single book by ID |
| **POST** | /api/books | Add a new book |
| **PUT** | /api/books/:id | Update a book |
| **DELETE** | /api/books/:id | Delete a book |

### 🔄 Borrows

| Method | Endpoint | Description |
|-------------|----------|----------|
| **GET** | /api/borrows/summary | Borrow a book |
| **POST** | /api/borrows/:bookId | Add a new book |

---

## 🧠 Error Handling

All routes use a centralized error handler that:

- Logs detailed errors in the console for debugging
- Returns clean, user-friendly messages in JSON responses
  
Example error response:
```
{
  "message": "Book not found"
}
```

## 🧪 Example Request
### Add a new book
```
POST /api/books
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "genre": "Programming",
  "isbn": "9780132350884",
  "description": "A handbook of agile software craftsmanship",
  "copies": 5
}
```
### Response:
```
{
  "message": "Book created successfully",
  "book": { ... }
}
```
--- 
## 🧰 Scripts

| Command	| Description |
|-------------|----------|
| npm run dev |	Run the server in development mode |
npm run build |	Compile TypeScript to JavaScript |
npm start	Start | the production server |
npm run lint | Run ESLint (if configured) |

---

## 🧑‍💻 Author

[Mohammad Al Amin](https://mash02-portfolio.netlify.app/)
Full Stack Web Developer | React & Node.js Enthusiast
📧 mash.dev02@gmail.com

---

## 🌐 Contact
| [LinkedIn](https://www.linkedin.com/in/mash02/)

---

## 🏁 License
This project is licensed under the MIT License — feel free to use, modify, and distribute it.
