// Function to search by symptoms only
async function searchBySymptoms(symptoms) {
    if (!symptoms) {
        alert('Please enter symptoms to search for doctors.');
        return;
    }
    
    try {
        const params = {
            symptoms: symptoms,
            location: locationInput.value.trim(),
            specialty: document.getElementById('specialty-filter').value,
            rating: document.getElementById('rating-filter').value
        };
        
        const filteredDoctors = await apiService.searchDoctors(params);
        
        if (filteredDoctors.length === 0) {
            alert('No doctors found matching your symptoms. Try different symptoms.');
            return;
        }

        // Store the results for sorting
        currentSearchResults = [...filteredDoctors];
        
        // Calculate distances if user location is available for sorting
        if (userLocation) {
            currentSearchResults.forEach(doctor => {
                doctor.distance = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    doctor.lat, doctor.lng
                );
            });
        }
        
        // Apply initial sorting
        const sortedResults = sortDoctors([...currentSearchResults], sortResults.value);
        
        // Display the doctors
        displayDoctors(sortedResults, doctorsGrid);
        searchSection.style.display = 'block';
        resultsSection.style.display = 'block';
        allDoctorsSection.style.display = 'none';
        registrationSection.style.display = 'none';
        appointmentsSection.style.display = 'none';
        
        // Update results count
        resultsCount.textContent = `Showing ${filteredDoctors.length} doctor${filteredDoctors.length !== 1 ? 's' : ''} for "${symptoms}"`;
    } catch (error) {
        alert('Search failed. Please try again.');
        console.error('Search error:', error);
    }
}

// New function to find doctors by location
async function findDoctorsByLocation(locationText) {
    if (!locationText) {
        alert('Please enter a location to search for doctors.');
        return;
    }
    
    try {
        const params = {
            location: locationText,
            specialty: document.getElementById('specialty-filter').value,
            rating: document.getElementById('rating-filter').value
        };
        
        const filteredDoctors = await apiService.searchDoctors(params);
        
        if (filteredDoctors.length === 0) {
            alert(`No doctors found in ${locationText}. Try a different location.`);
            return;
        }
        
        // Store the results for sorting
        currentSearchResults = [...filteredDoctors];
        
        // Calculate distances if user location is available for sorting
        if (userLocation) {
            currentSearchResults.forEach(doctor => {
                doctor.distance = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    doctor.lat, doctor.lng
                );
            });
        }
        
        // Apply initial sorting
        const sortedResults = sortDoctors([...currentSearchResults], sortResults.value);
        
        // Display the doctors
        displayDoctors(sortedResults, doctorsGrid);
        searchSection.style.display = 'block';
        resultsSection.style.display = 'block';
        allDoctorsSection.style.display = 'none';
        registrationSection.style.display = 'none';
        appointmentsSection.style.display = 'none';
        
        // Update results count
        resultsCount.textContent = `Showing ${filteredDoctors.length} doctor${filteredDoctors.length !== 1 ? 's' : ''} in ${locationText}`;
    } catch (error) {
        alert('Location search failed. Please try again.');
        console.error('Location search error:', error);
    }
}

// Display all doctors
async function displayAllDoctors() {
    try {
        const allDoctors = await apiService.getDoctors();
        displayDoctors(allDoctors, allDoctorsGrid);
    } catch (error) {
        alert('Failed to load doctors. Please try again.');
        console.error('Load doctors error:', error);
    }
}