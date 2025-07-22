# 🛒 Green Cart E-commerce Application

Green Cart is a comprehensive, full-stack e-commerce platform for buying **fruits, vegetables, plants, and seeds**. It supports secure user authentication, product management, cart functionalities, and responsive design. It is built using **Spring Boot** (backend), **React.js** (frontend), **JWT-based Spring Security**, and **MySQL** as the database.

---

## 🔰 Project Modules

- 👤 **Customer Module**  
  - Register and login
  - Browse products by category
  - Add/update/remove items in cart
  - Place orders

- 🛠️ **Admin Module**  
  - Login with admin credentials
  - Add/update/delete products
  - Manage categories and inventory
  - View orders and customer details

---

## 🚀 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Java
- Spring Boot
- Spring Security (with JWT)
- Spring Data JPA
- REST API

### Database
- MySQL

---

## 🔐 Authentication & Security

- Role-based authentication: Admin & Customer
- JWT (JSON Web Token) used for stateless API authentication
- Passwords hashed using BCrypt
- Access to endpoints is secured using Spring Security filters

---

## 📱 Responsive Design

Built with **Tailwind CSS** to ensure the application works seamlessly on:
- Desktop 💻
- Tablet 📱
- Mobile 📱

---

## 🛠️ How to Run the Project

### ✅ Prerequisites
- Java 17+
- Node.js 18+
- MySQL
- Maven
- Git

---

### 🧩 Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/green-cart.git
cd green-cart/backend
