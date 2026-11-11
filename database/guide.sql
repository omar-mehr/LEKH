INSERT INTO guide (
    title,
    description,
    equipment_type_id
)
VALUES
(
    'Getting Started with Raspberry Pi 4B',
    'Basic instructions for setting up and starting a Raspberry Pi 4B.',
    (SELECT id FROM equipment_type WHERE name = 'Raspberry Pi 4B')
),
(
    'Connecting Raspberry Pi 4B to a Network',
    'Instructions for connecting a Raspberry Pi 4B to a network.',
    (SELECT id FROM equipment_type WHERE name = 'Raspberry Pi 4B')
),
(
    'Getting Started with Arduino Uno',
    'Basic instructions for setting up an Arduino Uno.',
    (SELECT id FROM equipment_type WHERE name = 'Arduino Uno')
),
(
    'Uploading a Program to Arduino Uno',
    'Instructions for uploading a program to an Arduino Uno.',
    (SELECT id FROM equipment_type WHERE name = 'Arduino Uno')
),
(
    'Getting Started with Canon Camera',
    'Basic instructions for preparing the Canon camera for use.',
    (SELECT id FROM equipment_type WHERE name = 'Canon Camera')
),
(
    'Basic Camera Setup',
    'Instructions for configuring the Canon camera before taking photos.',
    (SELECT id FROM equipment_type WHERE name = 'Canon Camera')
);


INSERT INTO guide_step (
    guide_id,
    step_number,
    content,
    image_url,
    video_url
)
VALUES

-- Raspberry Pi 4B: Getting Started
(
    (SELECT id FROM guide WHERE title = 'Getting Started with Raspberry Pi 4B'),
    1,
    'Connect the Raspberry Pi to the power supply.',
    NULL,
    'https://www.raspberrypi.com/news/getting-started-raspberry-pi/'
),
(
    (SELECT id FROM guide WHERE title = 'Getting Started with Raspberry Pi 4B'),
    2,
    'Connect the required peripherals.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Getting Started with Raspberry Pi 4B'),
    3,
    'Start the Raspberry Pi and check that it boots correctly.',
    NULL,
    NULL
),

-- Raspberry Pi 4B: Network
(
    (SELECT id FROM guide WHERE title = 'Connecting Raspberry Pi 4B to a Network'),
    1,
    'Connect the Raspberry Pi to the network.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Connecting Raspberry Pi 4B to a Network'),
    2,
    'Check that the network connection is active.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Connecting Raspberry Pi 4B to a Network'),
    3,
    'Verify that the Raspberry Pi can access the network.',
    NULL,
    NULL
),

-- Arduino Uno: Getting Started
(
    (SELECT id FROM guide WHERE title = 'Getting Started with Arduino Uno'),
    1,
    'Connect the Arduino Uno to the computer using a USB cable.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Getting Started with Arduino Uno'),
    2,
    'Open the Arduino development environment.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Getting Started with Arduino Uno'),
    3,
    'Check that the Arduino Uno is detected.',
    NULL,
    NULL
),

-- Arduino Uno: Uploading Program
(
    (SELECT id FROM guide WHERE title = 'Uploading a Program to Arduino Uno'),
    1,
    'Open the program in the Arduino development environment.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Uploading a Program to Arduino Uno'),
    2,
    'Select the correct Arduino board and port.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Uploading a Program to Arduino Uno'),
    3,
    'Upload the program and check that it runs correctly.',
    NULL,
    NULL
),

-- Canon Camera: Getting Started
(
    (SELECT id FROM guide WHERE title = 'Getting Started with Canon Camera'),
    1,
    'Insert a charged battery into the camera.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Getting Started with Canon Camera'),
    2,
    'Insert a memory card.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Getting Started with Canon Camera'),
    3,
    'Turn on the camera and check the display.',
    NULL,
    NULL
),

-- Canon Camera: Basic Setup
(
    (SELECT id FROM guide WHERE title = 'Basic Camera Setup'),
    1,
    'Select the required shooting mode.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Basic Camera Setup'),
    2,
    'Adjust the focus settings.',
    NULL,
    NULL
),
(
    (SELECT id FROM guide WHERE title = 'Basic Camera Setup'),
    3,
    'Take a test photo and check the result.',
    NULL,
    NULL
);