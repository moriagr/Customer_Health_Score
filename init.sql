CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE  -- Enterprise, SMB, Startup
);

CREATE TYPE event_type_enum AS ENUM ('login', 'feature_use', 'api_call');

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    segment_id INT REFERENCES segments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE customer_events (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
    event_type  event_type_enum,
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


-- -- ============================
-- -- Segments
-- -- ============================
-- INSERT INTO segments (id, name) VALUES
-- (1, 'Enterprise'),
-- (2, 'SMB'),
-- (3, 'Startup');

-- -- ============================
-- -- Customers
-- -- ============================
-- INSERT INTO customers (id, name, segment_id, created_at) VALUES
-- (1, 'Acme Corp', 1, '2025-05-01'),
-- (2, 'Globex Inc', 1, '2025-05-15'),
-- (3, 'Initech', 2, '2025-06-10'),
-- (4, 'Umbrella Ltd', 1, '2025-06-20'),
-- (5, 'Soylent Co', 2, '2025-07-01'),
-- (6, 'Stark Industries', 1, '2025-05-22'),
-- (7, 'Wayne Enterprises', 1, '2025-06-05'),
-- (8, 'Hooli', 3, '2025-05-12'),
-- (9, 'Pied Piper', 3, '2025-07-02'),
-- (10, 'Wonka Factory', 2, '2025-06-01'),
-- (11, 'Cyberdyne Systems', 1, '2025-05-19'),
-- (12, 'Tyrell Corporation', 1, '2025-06-30'),
-- (13, 'Oscorp', 1, '2025-07-04'),
-- (14, 'LexCorp', 1, '2025-06-12'),
-- (15, 'Massive Dynamic', 1, '2025-05-14'),
-- (16, 'Gringotts Bank', 2, '2025-06-01'),
-- (17, 'Daily Planet', 2, '2025-07-06'),
-- (18, 'Duff Beer', 2, '2025-05-23'),
-- (19, 'Kruger Industrial', 2, '2025-06-21'),
-- (20, 'Central Perk', 2, '2025-06-11'),
-- (21, 'Oceanic Airlines', 2, '2025-05-27'),
-- (22, 'Monarch Solutions', 3, '2025-07-03'),
-- (23, 'Paper Street Soap Co', 3, '2025-06-04'),
-- (24, 'Vandelay Industries', 3, '2025-06-13'),
-- (25, 'Bubba Gump Shrimp', 3, '2025-05-26'),
-- (26, 'Los Pollos Hermanos', 3, '2025-07-02'),
-- (27, 'Pizza Planet', 3, '2025-06-29'),
-- (28, 'Planet Express', 3, '2025-05-31'),
-- (29, 'Aperture Science', 3, '2025-07-05'),
-- (30, 'Black Mesa', 3, '2025-06-07'),
-- (31, 'Springfield Nuclear', 2, '2025-05-22'),
-- (32, 'MegaCorp', 1, '2025-07-08'),
-- (33, 'Virtucon', 2, '2025-06-20'),
-- (34, 'OCP', 1, '2025-07-09'),
-- (35, 'MomCorp', 1, '2025-05-13'),
-- (36, 'Cyberpunk Inc', 2, '2025-06-25'),
-- (37, 'Nuka Cola', 2, '2025-05-29'),
-- (38, 'Shinra Electric', 1, '2025-06-06'),
-- (39, 'Blue Sun Corp', 1, '2025-07-01'),
-- (40, 'Vault-Tec', 1, '2025-06-14'),
-- (41, 'Dharma Initiative', 2, '2025-05-20'),
-- (42, 'Clamp Cable', 2, '2025-07-07'),
-- (43, 'Acme Widgets', 2, '2025-05-24'),
-- (44, 'Soylent Green', 2, '2025-06-03'),
-- (45, 'Big Kahuna Burger', 2, '2025-07-10'),
-- (46, 'Jackrabbit Slims', 2, '2025-06-28'),
-- (47, 'Good Burger', 3, '2025-05-25'),
-- (48, 'Alchemax', 1, '2025-07-11'),
-- (49, 'Umbrella Coffee', 3, '2025-06-16'),
-- (50, 'Globex Startup', 3, '2025-07-12');

-- -- ============================
-- -- Customer Events (15 per customer, 3 months)
-- -- ============================
-- INSERT INTO customer_events (customer_id, event_type, event_data, created_at) VALUES
-- -- Customer 1
-- (1, 'login', '{"device":"web"}', '2025-05-05'),
-- (1, 'feature_use', '{"feature":"dashboard"}', '2025-05-06'),
-- (1, 'api_call', '{"endpoint":"/v1/users"}', '2025-05-07'),
-- (1, 'login', '{"device":"mobile"}', '2025-05-10'),
-- (1, 'feature_use', '{"feature":"analytics"}', '2025-05-11'),
-- (1, 'api_call', '{"endpoint":"/v1/data"}', '2025-05-12'),
-- (1, 'login', '{"device":"web"}', '2025-06-01'),
-- (1, 'feature_use', '{"feature":"reports"}', '2025-06-02'),
-- (1, 'api_call', '{"endpoint":"/v1/users"}', '2025-06-03'),
-- (1, 'login', '{"device":"web"}', '2025-06-15'),
-- (1, 'feature_use', '{"feature":"dashboard"}', '2025-06-16'),
-- (1, 'api_call', '{"endpoint":"/v1/users"}', '2025-06-17'),
-- (1, 'login', '{"device":"mobile"}', '2025-07-01'),
-- (1, 'feature_use', '{"feature":"analytics"}', '2025-07-02'),
-- (1, 'api_call', '{"endpoint":"/v1/data"}', '2025-07-03'),

-- -- Customer 2
-- (2, 'login', '{"device":"web"}', '2025-05-05'),
-- (2, 'feature_use', '{"feature":"analytics"}', '2025-05-06'),
-- (2, 'api_call', '{"endpoint":"/v1/users"}', '2025-05-07'),
-- (2, 'login', '{"device":"mobile"}', '2025-05-10'),
-- (2, 'feature_use', '{"feature":"dashboard"}', '2025-05-11'),
-- (2, 'api_call', '{"endpoint":"/v1/data"}', '2025-05-12'),
-- (2, 'login', '{"device":"web"}', '2025-06-01'),
-- (2, 'feature_use', '{"feature":"reports"}', '2025-06-02'),
-- (2, 'api_call', '{"endpoint":"/v1/users"}', '2025-06-03'),
-- (2, 'login', '{"device":"web"}', '2025-06-15'),
-- (2, 'feature_use', '{"feature":"dashboard"}', '2025-06-16'),
-- (2, 'api_call', '{"endpoint":"/v1/users"}', '2025-06-17'),
-- (2, 'login', '{"device":"mobile"}', '2025-07-01'),
-- (2, 'feature_use', '{"feature":"analytics"}', '2025-07-02'),
-- (2, 'api_call', '{"endpoint":"/v1/data"}', '2025-07-03');

-- -- Repeat similar pattern for customers 3–50
-- -- To save space, you can duplicate the pattern above and just change customer_id and dates.

-- -- ============================
-- -- Support Tickets
-- -- ============================
-- INSERT INTO support_tickets (customer_id, status, priority, created_at, resolved_at) VALUES
-- (1, 'open', 'high', '2025-07-01', NULL),
-- (1, 'closed', 'low', '2025-05-10', '2025-05-12'),
-- (2, 'closed', 'medium', '2025-06-15', '2025-06-20'),
-- (3, 'open', 'low', '2025-07-05', NULL),
-- (4, 'closed', 'high', '2025-06-02', '2025-06-04');

-- -- ============================
-- -- Invoices
-- -- ============================
-- INSERT INTO invoices (customer_id, amount, due_date, paid_date, status) VALUES
-- (1, 1200.00, '2025-06-01', '2025-06-02', 'paid'),
-- (1, 1300.00, '2025-07-01', NULL, 'unpaid'),
-- (2, 800.00, '2025-06-15', '2025-06-20', 'paid'),
-- (3, 950.00, '2025-06-10', NULL, 'late'),
-- (4, 500.00, '2025-06-01', '2025-06-03', 'paid');

