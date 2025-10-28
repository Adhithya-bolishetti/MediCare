function initMap() {
    // Initialize map centered on the US
    map = L.map('map').setView([39.8283, -98.5795], 4);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function getCurrentLocationForSearch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                updateMapWithUserLocation();
                reverseGeocode(userLocation.lat, userLocation.lng);
                
                // After getting location, search for doctors nearby
                const locationText = locationInput.value.trim();
                if (locationText) {
                    findDoctorsByLocation(locationText);
                } else {
                    // If no location text, use the reverse geocoded city
                    findDoctorsByLocation(locationInput.value);
                }
            },
            (error) => {
                alert('Unable to retrieve your location. Please enter a location manually.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by this browser. Please enter your location manually.');
    }
}

function reverseGeocode(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.display_name) {
                locationInput.value = data.display_name;
            }
        })
        .catch(error => {
            console.error('Reverse geocoding error:', error);
        });
}

function updateMapWithUserLocation() {
    // Clear existing markers
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    doctorMarkers.forEach(marker => map.removeLayer(marker));
    doctorMarkers = [];
    
    // Add user marker
    userMarker = L.marker([userLocation.lat, userLocation.lng])
        .addTo(map)
        .bindPopup('Your Location')
        .openPopup();
    
    // Center map on user location
    map.setView([userLocation.lat, userLocation.lng], 12);
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

// Show doctor location on map in modal
function showDoctorLocation(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;
    
    // Clear existing markers
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    doctorMarkers.forEach(marker => map.removeLayer(marker));
    doctorMarkers = [];
    
    // Add doctor marker
    const doctorMarker = L.marker([doctor.lat, doctor.lng])
        .addTo(map)
        .bindPopup(`
            <b>${doctor.name}</b><br>
            ${doctor.specialty}<br>
            ${doctor.address}, ${doctor.city}
        `)
        .openPopup();
    doctorMarkers.push(doctorMarker);
    
    // Center map on doctor location
    map.setView([doctor.lat, doctor.lng], 13);
    
    // Update modal info
    mapDoctorName.textContent = doctor.name;
    
    // Show map modal
    mapModal.style.display = 'flex';
}