# MediFind - Doctor Recommendation System

## 📋 Overview

MediFind is a comprehensive web application that helps users find and book appointments with healthcare professionals based on their symptoms, location, and preferences. The platform also allows doctors to register their profiles and manage appointments.

## ✨ Features

### 👨‍⚕️ For Patients
- **🔍 Symptom-based Search**: Find doctors based on specific symptoms or medical conditions
- **📍 Location-based Search**: Search doctors by location or use current location
- **⚡ Advanced Filtering**: Filter by distance, specialty, and rating
- **📄 Doctor Profiles**: View detailed information about doctors including education, experience, and reviews
- **📅 Appointment Booking**: Book appointments with available time slots
- **⭐ Review System**: Rate and review doctors
- **🗺️ Interactive Map**: View doctor locations on an interactive map

### 🩺 For Doctors
- **📝 Profile Registration**: Complete registration form with professional details
- **👤 Profile Management**: View and edit professional profile
- **📊 Appointment Management**: View and manage patient appointments
- **🌟 Rating & Reviews**: Receive and display patient feedback

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Maps**: Leaflet.js for interactive maps
- **Icons**: Font Awesome for UI icons
- **Styling**: Custom CSS with responsive design
- **Data Storage**: Browser localStorage (for demo purposes)

## 📁 File Structure
medifind/
├── index.html
├── css/
│ └── style.css
├── js/
│ ├── app.js # Main application logic
│ ├── auth.js # Authentication handling
│ ├── data.js # Sample data and storage
│ ├── api.js # API simulations
│ ├── map.js # Map functionality
│ ├── doctors.js # Doctor management
│ ├── appointments.js # Appointment handling
│ └── reviews.js # Review system
└── README.md


## 🚀 Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Local web server for running the application

### Steps
1. **Download the project files**
2. **Set up a local server** using one of these methods:

   **Option 1: VS Code with Live Server**
   ```bash
   # Install Live Server extension
   # Right-click index.html and select "Open with Live Server"
