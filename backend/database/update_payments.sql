-- Add payment columns to update existing bookings table
ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN stripe_payment_id VARCHAR(255);
ALTER TABLE bookings ADD COLUMN payment_method VARCHAR(50);
ALTER TABLE bookings ADD COLUMN refund_status VARCHAR(20);
ALTER TABLE bookings ADD COLUMN refund_amount DECIMAL(10,2);
ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create payments table for better tracking (optional but recommended)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    stripe_payment_intent_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'lkr',
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
