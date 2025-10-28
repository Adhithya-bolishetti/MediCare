// Review modal functionality
function openReviewModal(doctorId, showForm) {
    currentDoctorId = doctorId;
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (!doctor) return;
    
    modalDoctorName.textContent = `Reviews for ${doctor.name}`;
    displayReviews(doctorId);
    
    if (showForm) {
        reviewForm.style.display = 'block';
    } else {
        reviewForm.style.display = 'none';
    }
    
    reviewModal.style.display = 'flex';
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

// Update doctor rating based on all reviews
function updateDoctorRating(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
        const doctorReviews = reviews.filter(r => r.doctorId === doctorId);
        doctor.reviewCount = doctorReviews.length;
        if (doctorReviews.length > 0) {
            doctor.rating = doctorReviews.reduce((sum, review) => sum + review.rating, 0) / doctorReviews.length;
            // Round to one decimal place
            doctor.rating = Math.round(doctor.rating * 10) / 10;
        } else {
            doctor.rating = 0;
        }
    }
}

// Display reviews for a doctor
function displayReviews(doctorId) {
    const doctorReviews = reviews.filter(review => review.doctorId === doctorId)
                                .sort((a, b) => new Date(b.date) - new Date(a.date));
    
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
                <span class="review-date">${review.date}</span>
            </div>
            <div class="review-rating">${getStarRating(review.rating)}</div>
            <p>${review.comment}</p>
        `;
        reviewsList.appendChild(reviewItem);
    });
}