// User management functions
function loginUser(email, password, type) {
    const user = users.find(u => u.email === email && u.password === password && u.type === type);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForUser();
        authModal.style.display = 'none';
        alert(`Welcome back, ${user.name}!`);
    } else {
        alert('Invalid email, password, or user type. Please try again.');
    }
}

function signupUser(name, email, password, type) {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        alert('A user with this email already exists. Please use a different email.');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        type: type
    };
    
    users.push(newUser);
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForUser();
    signupModal.style.display = 'none';
    alert(`Account created successfully! Welcome, ${name}!`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForUser();
    alert('You have been logged out.');
}

function updateUIForUser() {
    if (currentUser) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = currentUser.name;
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        
        // Show/hide navigation based on user type
        if (currentUser.type === 'doctor') {
            navRegister.style.display = 'block';
            navAppointments.style.display = 'block';
            navSearch.style.display = 'none';
            navAllDoctors.style.display = 'none';
            
            // If on patient pages, redirect to doctor pages
            if (searchSection.style.display === 'block' || 
                allDoctorsSection.style.display === 'block' ||
                resultsSection.style.display === 'block') {
                showAppointmentsSection();
            }
        } else {
            // Patient user - hide appointments
            navRegister.style.display = 'none';
            navAppointments.style.display = 'none';
            navSearch.style.display = 'block';
            navAllDoctors.style.display = 'block';
            
            // If on doctor pages, redirect to patient pages
            if (registrationSection.style.display === 'block' || 
                appointmentsSection.style.display === 'block') {
                showSearchSection();
            }
        }
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
        navRegister.style.display = 'none';
        navAppointments.style.display = 'none';
        navSearch.style.display = 'block';
        navAllDoctors.style.display = 'block';
    }
}