-- E-commerce Platform Database Schema
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
