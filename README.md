## Project Description

**Project Name:** *Lab Equipment Knowledge Hub (LEKH)*


### Project Aim and Objectives

The aim of the Lab Equipment Knowledge Hub (LEKH) is to create a web-based system that makes it easier to manage, find and share information about laboratory equipment.

The system will:

Centralize information about laboratory equipment in one place.
Make it easier for students to find equipment and access guides, images and datasheets.
Allow users to see equipment availability and manage borrowing and returns.
Support reporting of faulty or damaged equipment.
Provide different functionality and access depending on the user's role.
Make the system accessible from computers and mobile devices on the local network.


### Software Requirements

**Functional Requirements**

- **Inventory & Asset Management**
  - *The system shall allow users with appropriate permissions to register, update, and archive equipment.*
  - *The system shall distinguish between equipment types and individual equipment units.*
  - *The system shall store information such as serial numbers, locations, images, datasheets, accessories, and spare parts.*
  - *The system shall support QR codes or asset tags for identifying individual equipment.*
  - *The system shall allow users to view the current status and availability of equipment.*

- **Loans, Bookings & Returns**
    - *The system shall allow users to request equipment for a specific period.*
    - *The system shall allow authorized users to approve or reject loan requests.*
    - *The system shall keep track of borrowed equipment and expected return dates.*
    - *The system shall allow equipment to be marked as returned.*
    - *The system shall prevent conflicting bookings for the same equipment unit.*

- **Availability Timeline**
    - *The system shall provide an overview of equipment availability over time.*
    - *The system shall display whether equipment is available, borrowed, reserved, or unavailable.*
    - *The system shall allow users to check availability before requesting equipment.*

- **Condition, Maintenance & Consumables**
    - *The system shall allow users with appropriate permissions to record the condition of equipment.*
    - *The system shall keep a history of maintenance and repairs.*
    - *The system shall support information about consumables, accessories, and spare parts*
    - *The system shall allow equipment to be marked as unavailable when maintenance or repairs are required.*

- **Fault Reporting & Troubleshooting**
    - *The system shall allow users to report faults or problems with equipment.*
    - *The system shall allow authorized users to update the status of reported faults.*
    - *The system shall store fault reports as part of the equipment history.*
    - *The system shall provide troubleshooting information when available.*

- **Guides & Technical Resources**
    -  *The system shall allow authorized users to add and manage guides and technical documentation.*
    -  *The system shall allow users to access datasheets, manuals, instructions, and other relevant resources.*
    -  *The system shall connect technical resources to the relevant equipment.*

- **Project Library & Idea Catalogue**
    - *The system shall allow users to create and manage project information.*
    - *The system shall allow projects to be connected to equipment used in the project.*
    - *The system shall provide a place for storing project documentation and related resources.*
    - *The system shall allow users to store and browse ideas for future projects.*

- **Search & Discovery**
    - *The system shall provide search functionality for equipment and knowledge resources.*
    - *The system shall allow users to filter and browse equipment based on relevant information.*
    - *The system shall organize information into categories to make equipment and resources easier to find.*

- **Users, Roles & Administration**
    - *The system shall provide user authentication.*
    - *The system shall support different user roles and permissions.*
    - *The system shall restrict functionality based on the user's role.*
    - *The system shall allow authorized administrators to manage users and their       permissions.*


**Non-Functional Requirements**
 - **Security**
    - *The system shall protect user and equipment data from unauthorized access.*
    - *The system shall use role-based access control.*
    - *The system shall securely handle user authentication and authorization.*
    - *Sensitive configuration data shall not be stored directly in the source code.*

- **Performance**
    - *The system should provide reasonable response times when searching, viewing, and updating information.*
    - *The system should be able to handle the expected number of users and equipment records without significant performance issues.*
- **Usability**

    - *The system shall have a clear and easy-to-understand user interface.*
    - *The system should be usable by users with different levels of technical knowledge.*
    - *The interface shall be responsive and usable on both computers and mobile devices.*

- **Deployment**
    - *The system shall be able to run locally within the laboratory environment.*
    - *The application should be accessible from devices connected to the same local network.*

- **Maintainability**
    - *The project shall include documentation explaining how to install, configure, and    run the system.*


## Installing

To run the LEKH project locally, the following software is required:

* Node.js
* npm
* PostgreSQL
* Git

### User Manual

### Windows 
---
#### 1. Clone the repository

The LEKH repository is private. You must have access to the GitHub organization before cloning it.

Open Windows Command Prompt (CMD) and run
```bash
git clone git@github.com:dipt-pa1493-ht26/pa1493-omme22-lekh-zda.git
```
Alternatively, you can clone it using HTTPS:

```bash
git clone https://github.com/dipt-pa1493-ht26/pa1493-omme22-lekh-zda.git
```

Enter the repository:

```bash
cd pa1493-omme22-lekh-zda
```

#### 2. Install PostgreSQL

Download PostgreSQL for Windows from the official website:

https://www.postgresql.org/download/windows/

Follow the installation instructions. Make sure PostgreSQL Server and the command-line tools are installed. You can use the default port 5432.

#### 3. Install Node.js and npm

Download and install the LTS version of Node.js for Windows from the official website:

https://nodejs.org/en/download

npm is included with the Node.js installation.

After installation, close Command Prompt, open a new Command Prompt window, and verify that both Node.js and npm are installed:
```bash
node --version
npm --version
```


#### 4. Install project dependencies

Install the required Node.js dependencies:

```bash
npm install
```

#### 5. Create the PostgreSQL user

During PostgreSQL installation, you were asked to create a password for the default `postgres` user. You will need this password for the following steps.

Open Windows Command Prompt (CMD) and connect to PostgreSQL:

```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -p 5432 -d postgres
```

Enter the password for the `postgres` user when prompted.

Inside PostgreSQL, create the application user:

```bash
CREATE ROLE lekh_user WITH LOGIN;
\password lekh_user
ALTER ROLE lekh_user WITH SUPERUSER;
```

The command `\password lekh_user` sets the password for the PostgreSQL role `lekh_user`. When prompted, enter `lekh_user` as the new password or choose your own password. Enter the same password again to confirm it.

**Important:** Remember this password. Later in this guide, you will need to enter it as the value of `DB_PASSWORD` in the application's `.env` file.

Exit PostgreSQL:

```bash
\q
```

The `lekh_user` account is used by the application to access the LEKH database. It is configured as a PostgreSQL superuser so it can run the database reset script.



#### 6. Configure environment variables

From the project root, create a `.env` file by copying the example file:

```bash
copy .env.example .env
```

Open `.env` in a text editor and update the database credentials:

```env
DB_HOST=localhost
DB_USER=lekh_user
DB_PASSWORD=your-password
DB_NAME=lekh
JWT_SECRET=your-jwt-secret
VITE_API_URL=http://localhost:3000
```

Replace `your-password` with the password you set for `lekh_user`.

Replace `your-jwt-secret` with a strong, unique secret used to sign authentication tokens.

Keep the `.env` file private. It contains sensitive configuration and must not be committed to Git.


#### 7. Set up the database tables

The project includes a database reset script that creates the database tables and their relationships.

**Warning:** The reset script drops and recreates the `lekh` database. Any existing data in that database will be deleted.

Open Windows Command Prompt (CMD) from the project root and run:

```bash
cd database
```

```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U lekh_user -p 5432 -d postgres -f reset-database.sql
```


Enter the password for the `lekh_user` user when prompted.

```bash
cd ..
```

This script creates the `lekh` database and sets up the tables required by the application.


#### Running

Make sure PostgreSQL is running and that the database setup script has completed successfully.

From the project root, run:

```bash
npm run dev
```

This starts both the frontend and backend.

The frontend will be available at:

```text
http://localhost:5175
```

The backend API will be available at:

```text
http://localhost:3000
```

Keep the terminal open while using the application.

 

### WSL / Ubuntu
---

#### 1. Clone the repository


You can clone the repository using SSH:

```bash
git clone git@github.com:dipt-pa1493-ht26/pa1493-omme22-lekh-zda.git
```

Alternatively, you can clone it using HTTPS:

```bash
git clone https://github.com/dipt-pa1493-ht26/pa1493-omme22-lekh-zda.git
```


Enter the repository:

```bash
cd pa1493-omme22-lekh-zda
```

#### 2. Install Node.js and npm

Even if you have already installed Node.js on your Windows machine, you must also install Node.js and npm inside WSL. Windows and WSL use separate installations, so installing Node.js on Windows alone is not sufficient to run the application correctly inside WSL.

**Check whether Node.js and npm are already installed:**

```bash
node --version
npm --version
```

If both commands display version numbers, continue to the next step. Also verify that the commands use the Linux installation:

```bash
which node
which npm
```

The paths should point to Linux locations, such as `/usr/bin/node` and `/usr/bin/npm`, rather than the Windows Node.js installation.

**If Node.js and npm are not installed, install them using the NodeSource repository:**

```bash
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install nodejs -y
```

After installation, refresh the shell's command cache:

```bash
hash -r
```

Verify that Node.js and npm are available:

```bash
which node
which npm
node --version
npm --version
```

Both `node` and `npm` should point to the Linux installation. Once both commands display version numbers, continue to the next step.


#### 3. Install project dependencies

Install the required Node.js dependencies:

```bash
npm install
```


#### 3. Install and start PostgreSQL

On Ubuntu/WSL, install PostgreSQL:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Start the PostgreSQL service:

```bash
sudo service postgresql start
```

Check that PostgreSQL is installed:

```bash
sudo -u postgres psql --version
```
A Permission denied warning about the current directory may appear when running this command from the project folder. If the PostgreSQL version is displayed, the check was successful.

#### 4. Create a PostgreSQL user

Create a PostgreSQL user for the LEKH application:

```bash
sudo -u postgres createuser --interactive
```

When prompted, enter the following answers:

```text
Enter name of role to add: lekh_user
Shall the new role be a superuser? (y/n) y
```

Set a password for the new user by opening PostgreSQL:

```bash
sudo -u postgres psql
```

Inside PostgreSQL, run:

```sql
\password lekh_user
```

When prompted, enter `lekh_user` as the new password or choose your own password. Enter the same password again to confirm it.

**Important:** Remember this password. Later in this guide, you will need to enter it as the value of `DB_PASSWORD` in the application's `.env` file.

Then exit PostgreSQL:

```sql
\q
```



#### 5. Configure environment variables**

Create a `.env` file by copying the provided template:

```bash
cp .env.example .env
```

Open `.env` and update the configuration:

```env
DB_HOST=localhost
DB_USER=lekh_user
DB_PASSWORD=your-password
DB_NAME=lekh
JWT_SECRET=your-jwt-secret
VITE_API_URL=http://localhost:3000
```

Replace `your-password` with the password you set for `lekh_user`.

Create a strong and unique value for `JWT_SECRET`. This secret is used by the application to sign authentication tokens.

The `.env` file contains sensitive information and must **not** be committed to Git.

#### 6. Set up the database tables

Run the database setup script from the `database` directory:

```bash
cd database
psql -U lekh_user -d postgres -h localhost -f reset-database.sql
cd ..
```

When prompted, enter the password you set for `lekh_user`.

This script creates the `lekh` database, creates the required tables, and sets up the database structure for the LEKH application.

**Warning:** The database reset script may remove existing data. Do not run it if you need to keep existing data.


#### Running

Before starting the application, make sure that PostgreSQL is running and that the LEKH database has been created and configured. Also make sure that the database setup script has been run as described in the installation guide.

From the project root, start the application with:

```bash
npm run dev
```

This starts both the frontend and backend.

The frontend will be available at:

```text
http://localhost:5175
```

The backend API will be available at:

```text
http://localhost:3000
```



### User Accounts

The application comes with a pre-configured administrator account.

**Administrator account:**

* Email: `admin@lekh.se`
* Password: `P@ssw0rd`

The administrator can log in to the application and access the administrator dashboard. From the administrator dashboard, the administrator can:

* Manage users.
* Create caretaker accounts.
* Manage user roles and access.

### Student Accounts

Students can create their own accounts when the application is running.

Students must register using their student email address. The email address must contain `@student`.

After registering, the student can log in and access the student functionality.

### Caretaker Accounts

Caretaker accounts can only be created by an administrator.

After logging in with the administrator account, the administrator can create caretaker accounts from the administrator dashboard. The administrator can also manage existing users and their roles.


## Implemented Features

The following features are currently implemented in LEKH:

### Inventory & Asset Management

* Equipment types and individual equipment units.
* Equipment locations.
* Equipment images.
* Equipment information and identification.
* QR code scanning and equipment identification.
* Manual equipment status management, including Out of Service, Under Maintenance and Retired.

### Loans & Returns

* Equipment loan requests.
* Approval of loan requests.
* Equipment checkout and returns.
* Condition photos at checkout and return.
* Due dates and renewals.
* Loan history for individual equipment units.
* Search for loans by loan ID.

### Fault Reporting

* Caretakers and administrators can report faults associated with equipment types.
* Students can report faults associated with individual equipment units.
* Students, caretakers and administrators can view fault reports.
* Caretakers and administrators can close fault reports.

### Search & Discovery

* Search for equipment and guides.

### Guides & Documentation

* Guide creation and editing.
* Step-by-step guide instructions.
* Guide images and video links.

### Users, Roles & Administration

* User registration and authentication.
* Student, caretaker and administrator roles.
* Role-based access to functionality.
* Administrator management of users and caretaker accounts.

### REST API & Audit Logging

* REST API for communication between the frontend and backend.
* Logging of relevant application actions.

### Responsive Interface

* Dashboard layout adjustments for desktop and mobile screens.


