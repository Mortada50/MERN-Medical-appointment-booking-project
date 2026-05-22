# Medical Appointment Booking System

A comprehensive web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) to facilitate appointment booking, scheduling, and management for healthcare providers and patients.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

This project provides a robust, secure, and user-friendly medical appointment booking system. It allows patients to schedule appointments with healthcare professionals, track their booking history, and receive real-time notifications. For healthcare providers, it offers a platform to manage schedules, appointments, and patient records efficiently.

## Features

- User authentication and role-based access (patient, doctor, admin)
- Secure patient registration and login
- Search and filter healthcare providers/doctors
- Book, cancel, and view appointment history
- Doctor dashboard to manage appointments and availability
- Email and/or SMS notifications for booking confirmations and reminders
- Responsive design for mobile and desktop
- Admin panel for system management

## Tech Stack

- **Frontend:** React.js, Redux, Bootstrap/Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt, Passport
- **Other:** Mongoose, Nodemailer, dotenv, and more

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/Mortada50/MERN-Medical-appointment-booking-project.git
    cd MERN-Medical-appointment-booking-project
    ```

2. **Install dependencies for backend**
    ```bash
    cd backend
    npm install
    # or yarn install
    ```

3. **Install dependencies for frontend**
    ```bash
    cd ../frontend
    npm install
    # or yarn install
    ```

4. **Set up environment variables**

    - Create a `.env` file in both `/backend` and `/frontend` as needed.
    - Example (backend):
        ```
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        EMAIL_USER=your_email
        EMAIL_PASS=your_email_password
        ```

5. **Run the backend server**
    ```bash
    cd ../backend
    npm run dev
    ```

6. **Run the frontend**
    ```bash
    cd ../frontend
    npm start
    ```

7. **Visit**
    ```
    http://localhost:3000
    ```

## Screenshots

> _Add screenshots of the main pages/features here. Example:_
>
> ![Appointment Booking](docs/screenshots/booking.png)
> ![Doctor Dashboard](docs/screenshots/doctor-dashboard.png)

## Usage

- Register as a user (patient or doctor)
- Log in to access dashboard
- Search for doctors and book appointments
- Doctors can manage their available slots and view bookings

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- **Author:** Mortada50
- **GitHub:** [Mortada50](https://github.com/Mortada50)
- **Project Repository:** [MERN-Medical-appointment-booking-project](https://github.com/Mortada50/MERN-Medical-appointment-booking-project)

