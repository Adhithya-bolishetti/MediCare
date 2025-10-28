// Review modal functionality
async function openReviewModal(doctorId, showForm) {
    currentDoctorId = doctorId;
    
    try {
        // First try to get doctor by ID
        let doctor;
        try {
            doctor = await apiService.getDoctorById(doctorId);
        } catch (error) {
            console.log('Failed to get doctor by ID, trying fallback...');
            // Fallback: get all doctors and find the matching one
            const allDoctors = await apiService.getDoctors();
            doctor = allDoctors.find(d => d._id === doctorId);
        }
        
        if (!doctor) {
            alert('Doctor not found. Please try again.');
            return;
        }
        
        modalDoctorName.textContent = `Reviews for ${doctor.name}`;
        await displayReviews(doctorId);
        
        if (showForm) {
            reviewForm.style.display = 'block';
        } else {
            reviewForm.style.display = 'none';
        }
        
        reviewModal.style.display = 'flex';
    } catch (error) {
        console.error('Error opening review modal:', error);
        alert('Failed to load reviews. Please try again.');
    }
}

function setStarRating(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    document.getElementById('rating-value').value = rating;
}

// Display reviews for a doctor
async function displayReviews(doctorId) {
    try {
        const doctorReviews = await apiService.getReviews(doctorId);
        
        reviewsList.innerHTML = '<h4>Patient Reviews</h4>';
        
        if (doctorReviews.length === 0) {
            reviewsList.innerHTML += '<p>No reviews yet. Be the first to review this doctor!</p>';
            return;
        }
        
        doctorReviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-header">
                    <span class="review-author">${review.reviewer}</span>
                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div class="review-rating">${getStarRating(review.rating)}</div>
                <p>${review.comment}</p>
            `;
            reviewsList.appendChild(reviewItem);
        });
    } catch (error) {
        console.error('Display reviews error:', error);
        reviewsList.innerHTML = '<p>Error loading reviews. Please try again later.</p>';
    }
}

// Initialize star rating interaction
function initializeStarRating() {
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            setStarRating(rating);
        });
        
        star.addEventListener('mouseover', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            const stars = document.querySelectorAll('.star');
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            const stars = document.querySelectorAll('.star');
            stars.forEach(s => {
                s.classList.remove('hover');
            });
        });
    });
}

// FIXED: Submit review with proper error handling
async function submitReview(event) {
    event.preventDefault();
    
    const reviewerName = document.getElementById('reviewer-name').value;
    const rating = parseInt(document.getElementById('rating-value').value);
    const comment = document.getElementById('review-comment').value;
    
    if (rating === 0) {
        alert('Please select a rating.');
        return;
    }
    
    if (!reviewerName || !comment) {
        alert('Please fill in all fields.');
        return;
    }
    
    try {
        const reviewData = {
            doctorId: currentDoctorId,
            reviewer: reviewerName,
            rating: rating,
            comment: comment
        };
        
        const result = await apiService.addReview(reviewData);
        
        if (result.error) {
            alert('Error submitting review: ' + result.error);
            return;
        }
        
        // Refresh the reviews display
        await displayReviews(currentDoctorId);
        
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
        
        reviewForm.reset();
        setStarRating(0);
        alert('Thank you for your review!');
    } catch (error) {
        alert('Failed to submit review. Please try again.');
        console.error('Submit review error:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize star rating
    initializeStarRating();
    
    // FIXED: Add event listener for review form submission
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', submitReview);
    }
});