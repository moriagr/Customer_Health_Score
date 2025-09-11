CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE  -- Enterprise, SMB, Startup
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    segment_id INT REFERENCES segments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE customer_events (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,   -- login, feature_use, api_call
    event_data JSONB,                  -- extra details (feature name, endpoint, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,       -- open, closed, pending
    priority VARCHAR(20),              -- low, medium, high
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(20) DEFAULT 'unpaid'   -- unpaid, paid, late
);


-- CREATE TABLE features (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     description TEXT
-- );

-- CREATE TABLE customer_features (
--     customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
--     feature_id INT REFERENCES features(id) ON DELETE CASCADE,
--     first_used_at TIMESTAMP
-- );

-- Insert fixed segments
INSERT INTO segments (name) VALUES
('Enterprise'),
('startup'),
('SMB')
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO customer_events (customer_id, event_type, event_date) VALUES
(1, 'login', NOW() - INTERVAL '1 day'),
(1, 'feature_used', NOW() - INTERVAL '2 days'),
(2, 'support_ticket', NOW() - INTERVAL '5 days'),
(3, 'invoice_paid', NOW() - INTERVAL '10 days')
ON CONFLICT DO NOTHING;
