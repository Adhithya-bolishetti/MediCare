// User management functions
async function loginUser(email, password, type) {
    try {
        const result = await apiService.login({ email, password, type });
        
        if (result.error) {
            alert(result.error);
            return;
        }
        
        currentUser = result;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForUser();
        authModal.style.display = 'none';
        alert(`Welcome back, ${currentUser.name}!`);
    } catch (error) {
        alert('Login failed. Please try again.');
        console.error('Login error:', error);
    }
}

async function signupUser(name, email, password, type) {
    try {
        const result = await apiService.signup({ name, email, password, type });
        
        if (result.error) {
            alert(result.error);
            return;
        }
        
        currentUser = result;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForUser();
        signupModal.style.display = 'none';
        alert(`Account created successfully! Welcome, ${name}!`);
    } catch (error) {
        alert('Signup failed. Please try again.');
        console.error('Signup error:', error);
    }
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