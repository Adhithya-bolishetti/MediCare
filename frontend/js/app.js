// Global variables
let currentUser = null;
let userLocation = null;
let map = null;
let userMarker = null;
let doctorMarkers = [];

// Current doctor being reviewed
let currentDoctorId = null;
let currentSearchType = null; // 'symptoms' or 'location'
let currentSearchResults = []; // Store current search results for sorting

// DOM Elements
const searchSection = document.getElementById('search-section');
const resultsSection = document.getElementById('results-section');
const allDoctorsSection = document.getElementById('all-doctors-section');
const registrationSection = document.getElementById('registration-section');
const appointmentsSection = document.getElementById('appointments-section');
const profileSection = document.getElementById('profile-section');
const searchForm = document.getElementById('search-form');
const symptomsInput = document.getElementById('symptoms-input');
const locationInput = document.getElementById('location-input');
const useCurrentLocationBtn = document.getElementById('use-current-location');
const doctorsGrid = document.getElementById('doctors-grid');
const allDoctorsGrid = document.getElementById('all-doctors-grid');
const resultsCount = document.getElementById('results-count');
const allDoctorsCount = document.getElementById('all-doctors-count');
const doctorRegistrationForm = document.getElementById('doctor-registration-form');
const reviewModal = document.getElementById('review-modal');
const reviewForm = document.getElementById('review-form');
const closeModal = document.getElementById('close-modal');
const reviewsList = document.getElementById('reviews-list');
const modalDoctorName = document.getElementById('modal-doctor-name');
const navSearch = document.getElementById('nav-search');
const navAllDoctors = document.getElementById('nav-all-doctors');
const navRegister = document.getElementById('nav-register');
const navProfile = document.getElementById('nav-profile');
const navAppointments = document.getElementById('nav-appointments');
const sortAllDoctors = document.getElementById('sort-all-doctors');
const sortResults = document.getElementById('sort-results');
const symptomButtons = document.querySelectorAll('.symptom-btn');

// Auth elements
const authButtons = document.getElementById('auth-buttons');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const authModal = document.getElementById('auth-modal');
const signupModal = document.getElementById('signup-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const closeSignupModal = document.getElementById('close-signup-modal');
const loginOptions = document.querySelectorAll('.login-option');
const customerLoginForm = document.getElementById('customer-login-form');
const doctorLoginForm = document.getElementById('doctor-login-form');
const customerSignupForm = document.getElementById('customer-signup-form');
const doctorSignupForm = document.getElementById('doctor-signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');

// Map modal elements
const mapModal = document.getElementById('map-modal');
const closeMapModal = document.getElementById('close-map-modal');
const mapInfo = document.getElementById('map-info');
const mapDoctorName = document.getElementById('map-doctor-name');

// New booking modal elements
const bookingModal = document.getElementById('booking-modal');
const closeBookingModal = document.getElementById('close-booking-modal');
const bookingForm = document.getElementById('booking-form');
const bookingDoctor = document.getElementById('booking-doctor');
const bookingDate = document.getElementById('booking-date');
const bookingTime = document.getElementById('booking-time');
const bookingReason = document.getElementById('booking-reason');
const slotError = document.getElementById('slot-error');
const availableSlots = document.getElementById('available-slots');
const slotOptions = document.getElementById('slot-options');

// Appointments elements
const appointmentsList = document.getElementById('appointments-list');

// Profile elements
const profileSuccessMessage = document.getElementById('profile-success-message');
const editProfileBtn = document.getElementById('edit-profile-btn');
const viewAppointmentsBtn = document.getElementById('view-appointments-btn');
const profileDoctorName = document.getElementById('profile-doctor-name');
const profileSpecialty = document.getElementById('profile-specialty');
const profileLocation = document.getElementById('profile-location');
const profileRating = document.getElementById('profile-rating');
const profileRatingValue = document.getElementById('profile-rating-value');
const profileReviewsCount = document.getElementById('profile-reviews-count');
const profileEmail = document.getElementById('profile-email');
const profilePhone = document.getElementById('profile-phone');
const profileEducation = document.getElementById('profile-education');
const profileBio = document.getElementById('profile-bio');
const profileExperience = document.getElementById('profile-experience');
const registrationSubmitBtn = document.getElementById('registration-submit-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser();
    }
    
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
        appointments = JSON.parse(savedAppointments);
    }
    
    // Initialize map
    initMap();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show search section by default
    showSearchSection();
    
    // Set minimum date to today for booking
    const today = new Date().toISOString().split('T')[0];
    bookingDate.min = today;
    
    // Add event listener for date change to update available slots
    bookingDate.addEventListener('change', function() {
        if (currentDoctorId) {
            updateAvailableSlots(currentDoctorId, this.value);
        }
    });
});

function setupEventListeners() {
    // Navigation
    navSearch.addEventListener('click', (e) => {
        e.preventDefault();
        showSearchSection();
    });

    navAllDoctors.addEventListener('click', (e) => {
        e.preventDefault();
        showAllDoctorsSection();
    });

    navRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegistrationSection();
    });

    navProfile.addEventListener('click', (e) => {
        e.preventDefault();
        showProfileSection();
    });

    navAppointments.addEventListener('click', (e) => {
        e.preventDefault();
        showAppointmentsSection();
    });

    // Location functionality
    useCurrentLocationBtn.addEventListener('click', function() {
        const locationText = locationInput.value.trim();
        currentSearchType = 'location';
        
        if (locationText) {
            // Use the location from the input to search for doctors
            findDoctorsByLocation(locationText);
        } else {
            // If no location entered, get current location
            getCurrentLocationForSearch();
        }
    });

    // Auth
    loginBtn.addEventListener('click', () => {
        authModal.style.display = 'flex';
    });

    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'flex';
    });

    logoutBtn.addEventListener('click', logout);

    closeAuthModal.addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    closeSignupModal.addEventListener('click', () => {
        signupModal.style.display = 'none';
    });

    closeMapModal.addEventListener('click', () => {
        mapModal.style.display = 'none';
    });

    closeBookingModal.addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });

    // Login options
    loginOptions.forEach(option => {
        option.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Remove active class from all options
            loginOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Show appropriate form
            if (this.closest('.modal').id === 'auth-modal') {
                customerLoginForm.classList.remove('active');
                doctorLoginForm.classList.remove('active');
                
                if (type === 'customer') {
                    customerLoginForm.classList.add('active');
                } else {
                    doctorLoginForm.classList.add('active');
                }
            } else {
                customerSignupForm.classList.remove('active');
                doctorSignupForm.classList.remove('active');
                
                if (type === 'customer') {
                    customerSignupForm.classList.add('active');
                } else {
                    doctorSignupForm.classList.add('active');
                }
            }
        });
    });

    // Login forms
    customerLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('customer-email').value;
        const password = document.getElementById('customer-password').value;
        loginUser(email, password, 'customer');
    });

    doctorLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('doctor-email').value;
        const password = document.getElementById('doctor-password').value;
        loginUser(email, password, 'doctor');
    });

    // Signup forms
    customerSignupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('customer-signup-name').value;
        const email = document.getElementById('customer-signup-email').value;
        const password = document.getElementById('customer-signup-password').value;
        signupUser(name, email, password, 'customer');
    });

    doctorSignupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('doctor-signup-name').value;
        const email = document.getElementById('doctor-signup-email').value;
        const password = document.getElementById('doctor-signup-password').value;
        signupUser(name, email, password, 'doctor');
    });

    // Switch between login and signup
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.style.display = 'none';
        signupModal.style.display = 'flex';
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        authModal.style.display = 'flex';
    });

    // Quick symptom buttons
    symptomButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const symptom = e.target.getAttribute('data-symptom');
            symptomsInput.value = symptom;
            currentSearchType = 'symptoms';
            searchBySymptoms(symptom);
        });
    });

    // Search functionality
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const symptoms = symptomsInput.value.trim().toLowerCase();
        currentSearchType = 'symptoms';
        
        if (symptoms === '') {
            alert('Please enter symptoms to search for doctors.');
            return;
        }

        searchBySymptoms(symptoms);
    });

    // Doctor registration
    doctorRegistrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check if this is an update or new registration
        const existingDoctor = doctors.find(d => d.email === currentUser.email || d.name === currentUser.name);
        
        if (existingDoctor) {
            // Update existing doctor
            existingDoctor.name = document.getElementById('doctor-name').value;
            existingDoctor.specialty = document.getElementById('doctor-specialty').value;
            existingDoctor.email = document.getElementById('doctor-email').value;
            existingDoctor.phone = document.getElementById('doctor-phone').value;
            existingDoctor.address = document.getElementById('doctor-address').value;
            existingDoctor.city = document.getElementById('doctor-city').value;
            existingDoctor.bio = document.getElementById('doctor-bio').value;
            existingDoctor.education = document.getElementById('doctor-education').value;
            existingDoctor.experience = parseInt(document.getElementById('doctor-experience').value);
            
            // Update user data
            if (currentUser && currentUser.type === 'doctor') {
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex].name = existingDoctor.name;
                    currentUser.name = existingDoctor.name;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    updateUIForUser();
                }
            }
            
            alert('Profile updated successfully!');
            showProfileSection(existingDoctor);
        } else {
            // New registration
            const newDoctor = {
                id: doctors.length + 1,
                name: document.getElementById('doctor-name').value,
                specialty: document.getElementById('doctor-specialty').value,
                email: document.getElementById('doctor-email').value,
                phone: document.getElementById('doctor-phone').value,
                address: document.getElementById('doctor-address').value,
                city: document.getElementById('doctor-city').value,
                lat: getRandomInRange(35, 45), // Random latitude for demo
                lng: getRandomInRange(-120, -75), // Random longitude for demo
                bio: document.getElementById('doctor-bio').value,
                education: document.getElementById('doctor-education').value,
                experience: parseInt(document.getElementById('doctor-experience').value),
                rating: 0,
                reviewCount: 0
            };
            
            doctors.push(newDoctor);
            
            // Also update the user's data if they're logged in as this doctor
            if (currentUser && currentUser.type === 'doctor') {
                // Update the user's name in the users array to match the registered doctor name
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex].name = newDoctor.name;
                    currentUser.name = newDoctor.name;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    updateUIForUser();
                }
            }
            
            alert('Registration successful! Your profile has been added to our system.');
            showProfileSection(newDoctor);
        }
    });

    // Review modal functionality
    closeModal.addEventListener('click', () => {
        reviewModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === reviewModal) {
            reviewModal.style.display = 'none';
        }
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
        if (e.target === mapModal) {
            mapModal.style.display = 'none';
        }
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // Star rating interaction
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            setStarRating(rating);
        });
    });

    // Submit review
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const reviewerName = document.getElementById('reviewer-name').value;
        const rating = parseInt(document.getElementById('rating-value').value);
        const comment = document.getElementById('review-comment').value;
        
        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }
        
        const newReview = {
            doctorId: currentDoctorId,
            reviewer: reviewerName,
            rating: rating,
            comment: comment,
            date: new Date().toISOString().split('T')[0]
        };
        
        reviews.push(newReview);
        
        // Update doctor's rating and review count
        updateDoctorRating(currentDoctorId);
        
        // Refresh the doctor displays
        if (resultsSection.style.display !== 'none') {
            if (currentSearchType === 'symptoms') {
                const symptoms = symptomsInput.value.trim().toLowerCase();
                if (symptoms) {
                    searchBySymptoms(symptoms);
                }
            } else if (currentSearchType === 'location') {
                const location = locationInput.value.trim();
                if (location) {
                    findDoctorsByLocation(location);
                }
            }
        }
        
        if (allDoctorsSection.style.display !== 'none') {
            displayAllDoctors();
        }
        
        displayReviews(currentDoctorId);
        reviewForm.reset();
        setStarRating(0);
        alert('Thank you for your review!');
    });

    // Sort all doctors when sort option changes
    sortAllDoctors.addEventListener('change', () => {
        if (allDoctorsSection.style.display !== 'none') {
            displayAllDoctors();
        }
    });

    // Sort results when sort option changes
    sortResults.addEventListener('change', () => {
        if (resultsSection.style.display !== 'none' && currentSearchResults.length > 0) {
            // Apply sorting to current search results
            const sortedResults = sortDoctors([...currentSearchResults], sortResults.value);
            displayDoctors(sortedResults, doctorsGrid);
        }
    });

    // Booking form submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        bookAppointment();
    });

    // Profile buttons
    editProfileBtn.addEventListener('click', () => {
        showRegistrationSection();
    });
    
    viewAppointmentsBtn.addEventListener('click', () => {
        showAppointmentsSection();
    });
}

// Navigation functions
function showSearchSection() {
    searchSection.style.display = 'block';
    resultsSection.style.display = 'none';
    allDoctorsSection.style.display = 'none';
    registrationSection.style.display = 'none';
    appointmentsSection.style.display = 'none';
    profileSection.style.display = 'none';
    navSearch.classList.add('active');
    navAllDoctors.classList.remove('active');
    navRegister.classList.remove('active');
    navProfile.classList.remove('active');
    navAppointments.classList.remove('active');
}

function showAllDoctorsSection() {
    searchSection.style.display = 'none';
    resultsSection.style.display = 'none';
    allDoctorsSection.style.display = 'block';
    registrationSection.style.display = 'none';
    appointmentsSection.style.display = 'none';
    profileSection.style.display = 'none';
    navSearch.classList.remove('active');
    navAllDoctors.classList.add('active');
    navRegister.classList.remove('active');
    navProfile.classList.remove('active');
    navAppointments.classList.remove('active');
    displayAllDoctors();
}

function showRegistrationSection() {
    if (currentUser && currentUser.type === 'doctor') {
        // Check if doctor already has a profile
        const existingDoctor = doctors.find(d => d.email === currentUser.email || d.name === currentUser.name);
        
        if (existingDoctor) {
            // Pre-fill the form with existing data
            document.getElementById('doctor-name').value = existingDoctor.name;
            document.getElementById('doctor-specialty').value = existingDoctor.specialty;
            document.getElementById('doctor-email').value = existingDoctor.email;
            document.getElementById('doctor-phone').value = existingDoctor.phone;
            document.getElementById('doctor-address').value = existingDoctor.address;
            document.getElementById('doctor-city').value = existingDoctor.city;
            document.getElementById('doctor-bio').value = existingDoctor.bio;
            document.getElementById('doctor-education').value = existingDoctor.education;
            document.getElementById('doctor-experience').value = existingDoctor.experience;
            
            // Change button text to indicate update
            registrationSubmitBtn.textContent = 'Update Profile';
        } else {
            // Clear form for new registration
            doctorRegistrationForm.reset();
            registrationSubmitBtn.textContent = 'Register as Doctor';
        }
        
        searchSection.style.display = 'none';
        resultsSection.style.display = 'none';
        allDoctorsSection.style.display = 'none';
        registrationSection.style.display = 'block';
        appointmentsSection.style.display = 'none';
        profileSection.style.display = 'none';
        navSearch.classList.remove('active');
        navAllDoctors.classList.remove('active');
        navRegister.classList.add('active');
        navProfile.classList.remove('active');
        navAppointments.classList.remove('active');
    } else {
        alert('Only doctors can access the registration page. Please log in as a doctor.');
        authModal.style.display = 'flex';
    }
}

function showAppointmentsSection() {
    // Only doctors can see appointments
    if (currentUser && currentUser.type === 'doctor') {
        searchSection.style.display = 'none';
        resultsSection.style.display = 'none';
        allDoctorsSection.style.display = 'none';
        registrationSection.style.display = 'none';
        appointmentsSection.style.display = 'block';
        profileSection.style.display = 'none';
        navSearch.classList.remove('active');
        navAllDoctors.classList.remove('active');
        navRegister.classList.remove('active');
        navProfile.classList.remove('active');
        navAppointments.classList.add('active');
        
        // Load appointments
        displayAppointments();
    } else {
        alert('Only doctors can access the appointments page.');
        showSearchSection();
    }
}

// Function to show profile section
function showProfileSection(doctor = null) {
    // If doctor is provided (from registration), use that, otherwise find current doctor
    let currentDoctor = doctor;
    if (!currentDoctor && currentUser && currentUser.type === 'doctor') {
        currentDoctor = doctors.find(d => d.email === currentUser.email || d.name === currentUser.name);
    }
    
    if (!currentDoctor) {
        alert('Doctor profile not found. Please complete your registration.');
        showRegistrationSection();
        return;
    }
    
    // Update profile information
    profileDoctorName.textContent = currentDoctor.name;
    profileSpecialty.textContent = currentDoctor.specialty;
    profileLocation.textContent = `${currentDoctor.address}, ${currentDoctor.city}`;
    profileRating.innerHTML = getStarRating(currentDoctor.rating);
    profileRatingValue.textContent = currentDoctor.rating;
    profileReviewsCount.textContent = `(${currentDoctor.reviewCount} reviews)`;
    profileEmail.textContent = currentDoctor.email;
    profilePhone.textContent = currentDoctor.phone;
    profileEducation.textContent = currentDoctor.education;
    profileBio.textContent = currentDoctor.bio;
    profileExperience.textContent = currentDoctor.experience;
    
    // Show success message if coming from registration
    if (doctor) {
        profileSuccessMessage.style.display = 'block';
    } else {
        profileSuccessMessage.style.display = 'none';
    }
    
    // Show profile section and hide others
    searchSection.style.display = 'none';
    resultsSection.style.display = 'none';
    allDoctorsSection.style.display = 'none';
    registrationSection.style.display = 'none';
    appointmentsSection.style.display = 'none';
    profileSection.style.display = 'block';
    
    // Update navigation
    navSearch.classList.remove('active');
    navAllDoctors.classList.remove('active');
    navRegister.classList.remove('active');
    navProfile.classList.add('active');
    navAppointments.classList.remove('active');
}

// Doctor registration
doctorRegistrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        // Check if this is an update or new registration
        const allDoctors = await apiService.getDoctors();
        const existingDoctor = allDoctors.find(d => d.email === currentUser.email || d.name === currentUser.name);
        
        const doctorData = {
            name: document.getElementById('doctor-name').value,
            specialty: document.getElementById('doctor-specialty').value,
            email: document.getElementById('doctor-email').value,
            phone: document.getElementById('doctor-phone').value,
            address: document.getElementById('doctor-address').value,
            city: document.getElementById('doctor-city').value,
            lat: getRandomInRange(35, 45), // Random latitude for demo
            lng: getRandomInRange(-120, -75), // Random longitude for demo
            bio: document.getElementById('doctor-bio').value,
            education: document.getElementById('doctor-education').value,
            experience: parseInt(document.getElementById('doctor-experience').value),
            userId: currentUser.id
        };
        
        let doctor;
        if (existingDoctor) {
            // Update existing doctor - you might want to create an update endpoint
            doctor = existingDoctor;
            // For now, we'll just show a message that update is not implemented
            alert('Profile update functionality is not fully implemented in this version.');
        } else {
            // New registration
            doctor = await apiService.registerDoctor(doctorData);
            
            // Also update the user's data if they're logged in as this doctor
            if (currentUser && currentUser.type === 'doctor') {
                // Update the user's name in localStorage to match the registered doctor name
                currentUser.name = doctor.name;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUIForUser();
            }
            
            alert('Registration successful! Your profile has been added to our system.');
            showProfileSection(doctor);
        }
    } catch (error) {
        alert('Registration failed. Please try again.');
        console.error('Registration error:', error);
    }
});