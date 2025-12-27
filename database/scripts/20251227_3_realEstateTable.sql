CREATE TABLE real_estates_info (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  size_sqm INTEGER NOT NULL,
  price FLOAT NOT NULL,
  reference_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);