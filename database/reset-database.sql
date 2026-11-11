DROP DATABASE IF EXISTS lekh;

CREATE DATABASE lekh;

\c lekh


CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE equipment_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE individual_equipment (

    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    equipment_type_id INTEGER NOT NULL,
    location_id INTEGER,
    condition VARCHAR(50) NOT NULL
        CHECK (condition IN ('new', 'good', 'worn', 'damaged')),
    status VARCHAR(50) NOT NULL
        CHECK (status IN ('available', 'on_loan', 'maintenance', 'out_of_service','retired','reserved' )),
    mobility VARCHAR(50) NOT NULL
        CHECK (mobility IN ('stationary', 'portable')),
    FOREIGN KEY (equipment_type_id) REFERENCES equipment_type(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
);
CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone_number VARCHAR(30),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('student', 'caretaker', 'administrator'))
);

INSERT INTO app_user (
    name,
    email,
    address,
    phone_number,
    password_hash,
    role
)
VALUES (
    'Admin',
    'admin@lekh.se',
    'Lab',
    '0700000000',
    '$2b$10$D4ZNOLEaEVQuTZGl.GnjEOBWP52lAGuOsbeRwpq7KIaLQ7FrRCkYm',
    'administrator'
);


CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id INTEGER,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE borrow_request (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    equipment_id INTEGER NOT NULL,
    purpose TEXT NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app_user(id),
    FOREIGN KEY (equipment_id) REFERENCES individual_equipment(id)
);

CREATE TABLE loan (
    id SERIAL PRIMARY KEY,
    borrow_request_id INTEGER,
    user_id INTEGER NOT NULL,
    equipment_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (borrow_request_id) REFERENCES borrow_request(id),
    FOREIGN KEY (user_id) REFERENCES app_user(id),
    FOREIGN KEY (equipment_id) REFERENCES individual_equipment(id)
);

CREATE TABLE renewal_request (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('pending', 'approved', 'rejected')),
    FOREIGN KEY (loan_id) REFERENCES loan(id)
);

\i triggers.sql
\i equipment-data.sql

CREATE TABLE guide (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    equipment_type_id INTEGER NOT NULL,
    FOREIGN KEY (equipment_type_id) REFERENCES equipment_type(id)
);

CREATE TABLE guide_step (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    FOREIGN KEY (guide_id) REFERENCES guide(id)
);

\i guide.sql

CREATE TABLE condition_photo (
    id SERIAL PRIMARY KEY,
    photo_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    loan_id INTEGER NOT NULL,
    FOREIGN KEY (loan_id) REFERENCES loan(id)
);

CREATE TABLE fault_reports (
    id SERIAL PRIMARY KEY,
    equipment_unit_id INTEGER REFERENCES individual_equipment(id),
    equipment_type_id INTEGER REFERENCES equipment_type(id),
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (equipment_unit_id IS NOT NULL AND equipment_type_id IS NULL)
        OR
        (equipment_unit_id IS NULL AND equipment_type_id IS NOT NULL)
    )
);