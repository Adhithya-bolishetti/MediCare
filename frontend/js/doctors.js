// Function to search by symptoms only
function searchBySymptoms(symptoms) {
    if (!symptoms) {
        alert('Please enter symptoms to search for doctors.');
        return;
    }
    
    // First, check if symptoms match any in our mapping
    let recommendedSpecialties = new Set();
    
    // Check each symptom in the mapping
    Object.keys(symptomMapping).forEach(symptom => {
        if (symptoms.includes(symptom)) {
            symptomMapping[symptom].forEach(specialty => {
                recommendedSpecialties.add(specialty);
            });
        }
    });

    // If we have specific symptom matches, prioritize those specialties
    let filteredDoctors = [];
    if (recommendedSpecialties.size > 0) {
        filteredDoctors = doctors.filter(doctor => {
            return Array.from(recommendedSpecialties).some(specialty => 
                doctor.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
                specialty.toLowerCase().includes(doctor.specialty.toLowerCase())
            );
        });
        
        // Also include doctors whose bio matches the symptoms
        const bioMatches = doctors.filter(doctor => {
            return doctor.bio.toLowerCase().includes(symptoms) ||
                   symptoms.split(' ').some(word => 
                       doctor.bio.toLowerCase().includes(word) && word.length > 3
                   );
        });
        
        // Combine both sets, removing duplicates
        const allMatches = [...filteredDoctors, ...bioMatches];
        filteredDoctors = allMatches.filter((doctor, index, self) => 
            index === self.findIndex(d => d.id === doctor.id)
        );
    } else {
        // Fallback to original search if no specific symptoms matched
        filteredDoctors = doctors.filter(doctor => {
            const specialty = doctor.specialty.toLowerCase();
            const bio = doctor.bio.toLowerCase();
            
            return specialty.includes(symptoms) || 
                   symptoms.includes(specialty) ||
                   symptoms.split(' ').some(word => 
                       specialty.includes(word) || 
                       bio.includes(word)
                   );
        });
    }

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
}

// New function to find doctors by location
function findDoctorsByLocation(locationText) {
    if (!locationText) {
        alert('Please enter a location to search for doctors.');
        return;
    }
    
    // Filter doctors by city (case insensitive)
    const filteredDoctors = doctors.filter(doctor => 
        doctor.city.toLowerCase().includes(locationText.toLowerCase()) ||
        doctor.address.toLowerCase().includes(locationText.toLowerCase()) ||
        locationText.toLowerCase().includes(doctor.city.toLowerCase())
    );
    
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
}

// Function to sort doctors based on selected criteria
function sortDoctors(doctorsToSort, sortValue) {
    return doctorsToSort.sort((a, b) => {
        if (sortValue === 'rating-desc') {
            return b.rating - a.rating;
        } else if (sortValue === 'distance-asc') {
            // For distance sorting, we need user location
            if (userLocation) {
                return (a.distance || Infinity) - (b.distance || Infinity);
            } else {
                // If no location, prompt user to enable location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            userLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            // Re-sort with new location
                            const reSorted = sortDoctors([...doctorsToSort], 'distance-asc');
                            displayDoctors(reSorted, doctorsGrid);
                        },
                        (error) => {
                            alert('Location is required for sorting by distance. Please enable location services.');
                        }
                    );
                }
                return b.rating - a.rating; // Fallback to rating
            }
        } else if (sortValue === 'name-asc') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });
}

// Display doctors in the grid
function displayDoctors(doctorsToShow, gridElement) {
    gridElement.innerHTML = '';
    
    if (doctorsToShow.length === 0) {
        gridElement.innerHTML = '<p>No doctors found matching your criteria. Try different symptoms or filters.</p>';
        if (gridElement === doctorsGrid) {
            resultsCount.textContent = 'Showing 0 results';
        }
        return;
    }

    // Apply filters for search results
    if (gridElement === doctorsGrid) {
        const distanceFilter = document.getElementById('location-filter').value;
        const specialtyFilter = document.getElementById('specialty-filter').value;
        const ratingFilter = parseFloat(document.getElementById('rating-filter').value);

        doctorsToShow = doctorsToShow.filter(doctor => {
            if (specialtyFilter !== 'all' && doctor.specialty.toLowerCase() !== specialtyFilter) {
                return false;
            }
            
            if (distanceFilter !== 'all' && userLocation) {
                const maxDistance = parseFloat(distanceFilter);
                if (doctor.distance > maxDistance) {
                    return false;
                }
            }
            
            if (ratingFilter > 0 && doctor.rating < ratingFilter) {
                return false;
            }
            
            return true;
        });
    }

    // Apply sorting for all doctors
    if (gridElement === allDoctorsGrid) {
        const sortValue = sortAllDoctors.value;
        doctorsToShow.sort((a, b) => {
            if (sortValue === 'rating-desc') {
                return b.rating - a.rating;
            } else if (sortValue === 'name-asc') {
                return a.name.localeCompare(b.name);
            } else if (sortValue === 'specialty-asc') {
                return a.specialty.localeCompare(b.specialty);
            }
            return 0;
        });
    }

    doctorsToShow.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        
        // Determine specialty badge class
        const specialtyClass = `specialty-${doctor.specialty.toLowerCase().replace(' ', '-')}`;
        
        // Format distance if available
        let distanceText = '';
        if (doctor.distance !== undefined) {
            distanceText = `<p class="doctor-distance"><i class="fas fa-road"></i> ${doctor.distance.toFixed(1)} km away</p>`;
        }
        
        // Check if user is patient to show book appointment button
        const bookAppointmentButton = currentUser && currentUser.type !== 'doctor' 
            ? `<button class="btn btn-small book-appointment-btn" data-id="${doctor.id}">Book Appointment</button>`
            : '';
        
        doctorCard.innerHTML = `
            <div class="doctor-image">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="specialty-badge ${specialtyClass}">${doctor.specialty}</div>
            <div class="doctor-info">
                <h3 class="doctor-name">${doctor.name}</h3>
                <p class="doctor-specialty">${doctor.specialty}</p>
                <p class="doctor-location">
                    <i class="fas fa-map-marker-alt"></i> ${doctor.address}, ${doctor.city}
                </p>
                <div class="doctor-rating">
                    <div class="stars">${getStarRating(doctor.rating)}</div>
                    <span class="rating-value">${doctor.rating}</span>
                    <span class="reviews-count">(${doctor.reviewCount} reviews)</span>
                </div>
                ${distanceText}
                <p class="doctor-experience">${doctor.experience} years experience</p>
                <div class="doctor-actions">
                    <button class="btn btn-small view-reviews" data-id="${doctor.id}">View Reviews</button>
                    <button class="btn btn-small btn-warning add-review" data-id="${doctor.id}">Add Review</button>
                    <button class="btn btn-small btn-secondary show-location" data-id="${doctor.id}">Show Location</button>
                    ${bookAppointmentButton}
                </div>
            </div>
        `;
        gridElement.appendChild(doctorCard);
    });

    if (gridElement === doctorsGrid) {
        resultsCount.textContent = `Showing ${doctorsToShow.length} result${doctorsToShow.length !== 1 ? 's' : ''}`;
    } else if (gridElement === allDoctorsGrid) {
        allDoctorsCount.textContent = `Showing ${doctorsToShow.length} doctor${doctorsToShow.length !== 1 ? 's' : ''}`;
    }

    // Add event listeners to buttons
    document.querySelectorAll('.view-reviews').forEach(button => {
        button.addEventListener('click', (e) => {
            const doctorId = parseInt(e.target.getAttribute('data-id'));
            openReviewModal(doctorId, false);
        });
    });

    document.querySelectorAll('.add-review').forEach(button => {
        button.addEventListener('click', (e) => {
            const doctorId = parseInt(e.target.getAttribute('data-id'));
            openReviewModal(doctorId, true);
        });
    });

    document.querySelectorAll('.show-location').forEach(button => {
        button.addEventListener('click', (e) => {
            const doctorId = parseInt(e.target.getAttribute('data-id'));
            showDoctorLocation(doctorId);
        });
    });

    // Add event listener for book appointment buttons
    document.querySelectorAll('.book-appointment-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const doctorId = parseInt(e.target.getAttribute('data-id'));
            openBookingModal(doctorId);
        });
    });
}

// Display all doctors
function displayAllDoctors() {
    displayDoctors(doctors, allDoctorsGrid);
}

// Generate star rating HTML
function getStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (halfStar) {
        stars += '½';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}