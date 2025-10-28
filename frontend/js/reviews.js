// Review modal functionality
async function openReviewModal(doctorId, showForm) {
    currentDoctorId = doctorId;
    
    try {
        const doctor = await apiService.getDoctorById(doctorId);
        
        if (!doctor) return;
        
        modalDoctorName.textContent = `Reviews for ${doctor.name}`;
        await displayReviews(doctorId);
        
        if (showForm) {
            reviewForm.style.display = 'block';
        } else {
            reviewForm.style.display = 'none';
        }
        
        reviewModal.style.display = 'flex';
    } catch (error) {
        alert('Failed to load reviews. Please try again.');
        console.error('Load reviews error:', error);
    }
}

// Submit review
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reviewerName = document.getElementById('reviewer-name').value;
    const rating = parseInt(document.getElementById('rating-value').value);
    const comment = document.getElementById('review-comment').value;
    
    if (rating === 0) {
        alert('Please select a rating.');
        return;
    }
    
    try {
        const reviewData = {
            doctorId: currentDoctorId,
            reviewer: reviewerName,
            rating: rating,
            comment: comment
        };
        
        await apiService.addReview(reviewData);
        
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
});

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
    }
}