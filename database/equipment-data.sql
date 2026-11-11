INSERT INTO category (name)
VALUES
    ('Computers'),
    ('Microcontrollers'),
    ('Cameras');


INSERT INTO equipment_type (
    name,
    description,
    image_url,
    category_id
)
VALUES
    (
        'Raspberry Pi 4B',
        'Single-board computer for electronics and programming projects.',
         '/uploads/equipment-types/RaspBerryPi4B.jpg',
        (SELECT id FROM category WHERE name = 'Computers')
    ),
    (
        'Arduino Uno',
        'Microcontroller board for electronics projects.',
        '/uploads/equipment-types/ArduinoUno.jpg',
        (SELECT id FROM category WHERE name = 'Microcontrollers')
    ),
    (
        'Canon Camera',
        'Digital camera for photography and video projects.',
        '/uploads/equipment-types/Camera.jpg',
        (SELECT id FROM category WHERE name = 'Cameras')
    );


INSERT INTO location (name, description)
VALUES
    ('Electronics Lab', 'Main electronics laboratory.'),
    ('Storage Room', 'Equipment storage room.');


INSERT INTO individual_equipment (
    name,
    serial_number,
    equipment_type_id,
    location_id,
    condition,
    status,
    mobility
)
VALUES
    (
        'Raspberry Pi 4B',
        'RPI4B-001',
        (SELECT id FROM equipment_type WHERE name = 'Raspberry Pi 4B'),
        (SELECT id FROM location WHERE name = 'Electronics Lab'),
        'good',
        'available',
        'portable'
    ),
    (
        'Raspberry Pi 4B',
        'RPI4B-002',
        (SELECT id FROM equipment_type WHERE name = 'Raspberry Pi 4B'),
        (SELECT id FROM location WHERE name = 'Electronics Lab'),
        'good',
        'available',
        'portable'
    ),
    (
        'Arduino Uno',
        'ARD-UNO-001',
        (SELECT id FROM equipment_type WHERE name = 'Arduino Uno'),
        (SELECT id FROM location WHERE name = 'Electronics Lab'),
        'new',
        'available',
        'portable'
    ),
    (
        'Arduino Uno',
        'ARD-UNO-002',
        (SELECT id FROM equipment_type WHERE name = 'Arduino Uno'),
        (SELECT id FROM location WHERE name = 'Storage Room'),
        'good',
        'available',
        'portable'
    ),
    (
        'Canon Camera',
        'CAM-001',
        (SELECT id FROM equipment_type WHERE name = 'Canon Camera'),
        (SELECT id FROM location WHERE name = 'Electronics Lab'),
        'good',
        'available',
        'portable'
    );