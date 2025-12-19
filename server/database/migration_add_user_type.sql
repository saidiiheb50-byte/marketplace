-- Migration: Add user_type and seller payment tracking
-- Run this after the main schema

USE beja_marketplace;

-- Add user_type and seller payment fields to users table
ALTER TABLE users 
ADD COLUMN user_type ENUM('buyer', 'seller') DEFAULT 'buyer' AFTER role;

ALTER TABLE users 
ADD COLUMN seller_payment_status ENUM('pending', 'paid', 'expired') DEFAULT 'pending' AFTER user_type;

ALTER TABLE users 
ADD COLUMN seller_payment_date DATETIME NULL AFTER seller_payment_status;

ALTER TABLE users 
ADD COLUMN seller_payment_amount DECIMAL(10, 2) DEFAULT 0.00 AFTER seller_payment_date;

-- Create seller_payments table for payment history
CREATE TABLE IF NOT EXISTS seller_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  payment_note TEXT,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);
