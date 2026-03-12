# ElectraCore - E-Commerce Platform

ElectraCore is a modern, responsive e-commerce platform built with Node.js, Express, and MongoDB. It features a clean user interface, secure user authentication, and a dynamic product catalog.

## 🚀 Key Features

### � User Interface & Experience
- **Responsive Design**: Optimized for all devices, from desktops to mobile phones.
- **Dynamic Header**: A large, centered logo linked to the home page with a clean navigation structure.
- **Category Navigation**: A dedicated sticky navigation bar for quick access to Laptops, Phones, Accessories, and more.
- **Modern Product Cards**: High-quality placeholder images, dual pricing (original and discounted), and interactive action icons (Wishlist, Cart, Compare).
- **Smooth Pagination**: Clean navigation for large product lists.

### 🛡️ Security & Backend
- **Secure Authentication**: User registration and login system.
- **Password Hashing**: Passwords are securely hashed using `bcryptjs` before being stored in MongoDB.
- **Input Validation**: Robust client-side and server-side validation for all user-provided data.
- **Duplicate Prevention**: Prevents multiple registrations with the same email address.
- **Database Integration**: Powered by MongoDB Atlas for reliable data storage.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Security**: bcryptjs for password encryption
- **Environment Management**: @dotenvx/dotenvx for secure configuration

## 📁 Project Structure

```text
📁 shorouk 9/
├── 📁 models/          # Mongoose schemas (User.js)
├── 📁 public/          # Static assets
│   ├── 📁 css/         # Global styles (style.css)
│   ├── 📁 design/      # Project images and logo
│   ├── 📁 js/          # Frontend logic (main.js)
│   ├── index.html      # Home page
│   ├── laptops.html    # Laptop category
│   ├── phones.html     # Phones category
│   ├── accessories.html # Accessories category
│   └── ...             # Auth and profile pages
├── 📄 server.js        # Express server and API routes
├── 📄 .env             # Environment variables (MongoDB URI, PORT)
├── 📄 package.json     # Dependencies and scripts
└── 📄 README.md        # Project documentation
```

## ⚙️ Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   MONGODB_URI=your_mongodb_atlas_uri
   PORT=3000
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

4. **Access the platform:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serves the home page |
| POST | `/api/register` | Register a new user with validation and hashing |
| POST | `/api/login` | Secure user login |
| PUT | `/api/profile` | Update user profile information |
| GET | `/api/users` | Retrieve all users (for testing) |

---
&copy; 2026 ElectraCore. All rights reserved.
