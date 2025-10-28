// Function to open booking modal
async function openBookingModal(doctorId) {
    if (!currentUser) {
        alert('Please log in to book an appointment.');
        authModal.style.display = 'flex';
        return;
    }
    
    try {
        // Try to get doctor by ID, with fallback
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
        
        currentDoctorId = doctorId;
        bookingDoctor.value = `${doctor.name} - ${doctor.specialty}`;
        
        // Reset form
        bookingDate.value = '';
        bookingTime.innerHTML = '<option value="">Select Time</option>';
        bookingReason.value = '';
        slotError.style.display = 'none';
        availableSlots.style.display = 'none';
        
        bookingModal.style.display = 'flex';
    } catch (error) {
        console.error('Error opening booking modal:', error);
        alert('Failed to load doctor information.');
    }
}

// Function to update available time slots based on selected date
async function updateAvailableSlots(doctorId, date) {
    if (!date) return;
    
    try {
        // Get existing appointments for this doctor and date
        const existingAppointments = await apiService.getDoctorAppointments(doctorId);
        const bookedSlots = existingAppointments
            .filter(apt => apt.date === date && apt.status !== 'cancelled')
            .map(apt => apt.time);
        
        // Generate time slots from 9 AM to 5 PM in 30-minute intervals
        const timeSlots = [];
        for (let hour = 9; hour <= 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                timeSlots.push(timeString);
            }
        }
        
        const availableTimeSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
        
        // Update the time dropdown
        bookingTime.innerHTML = '<option value="">Select Time</option>';
        availableTimeSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            bookingTime.appendChild(option);
        });
        
        // Show available slots as buttons
        slotOptions.innerHTML = '';
        if (availableTimeSlots.length > 0) {
            availableTimeSlots.forEach(slot => {
                const slotButton = document.createElement('div');
                slotButton.className = 'slot-option';
                slotButton.textContent = slot;
                slotButton.addEventListener('click', () => {
                    // Remove selected class from all options
                    document.querySelectorAll('.slot-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    // Add selected class to clicked option
                    slotButton.classList.add('selected');
                    // Set the time in the dropdown
                    bookingTime.value = slot;
                    // Hide slot error if shown
                    slotError.style.display = 'none';
                });
                slotOptions.appendChild(slotButton);
            });
            availableSlots.style.display = 'block';
        } else {
            availableSlots.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating available slots:', error);
    }
}

// Function to book appointment
async function bookAppointment() {
    const doctorId = currentDoctorId;
    
    try {
        let doctor;
        try {
            doctor = await apiService.getDoctorById(doctorId);
        } catch (error) {
            console.log('Failed to get doctor by ID, trying fallback...');
            const allDoctors = await apiService.getDoctors();
            doctor = allDoctors.find(d => d._id === doctorId);
        }
        
        if (!doctor) {
            alert('Doctor not found. Please try again.');
            return;
        }
        
        const date = bookingDate.value;
        const time = bookingTime.value;
        const reason = bookingReason.value;
        
        if (!date || !time) {
            alert('Please select both date and time for your appointment.');
            return;
        }
        
        const appointmentData = {
            doctorId: doctorId,
            doctorName: doctor.name,
            doctorSpecialty: doctor.specialty,
            patientId: currentUser.id,
            patientName: currentUser.name,
            date: date,
            time: time,
            reason: reason,
            status: 'pending',
            duration: 30
        };
        
        const result = await apiService.bookAppointment(appointmentData);
        
        if (result.error) {
            slotError.style.display = 'block';
            return;
        }
        
        alert('Appointment booked successfully!');
        bookingModal.style.display = 'none';
        
        // If on appointments page (for doctors), refresh the list
        if (appointmentsSection.style.display === 'block' && currentUser.type === 'doctor') {
            displayAppointments();
        }
    } catch (error) {
        alert('Failed to book appointment. Please try again.');
        console.error('Booking error:', error);
    }
}

// FIXED: Function to display appointments (only for doctors)
async function displayAppointments() {
    appointmentsList.innerHTML = '';
    
    try {
        // Find the current doctor by matching email
        let currentDoctor = null;
        if (currentUser && currentUser.type === 'doctor') {
            const allDoctors = await apiService.getDoctors();
            currentDoctor = allDoctors.find(d => d.email === currentUser.email || d.name === currentUser.name);
        }
        
        if (!currentDoctor) {
            appointmentsList.innerHTML = `
                <div class="no-appointments">
                    <i class="fas fa-calendar-times fa-3x"></i>
                    <h3>Doctor profile not found</h3>
                    <p>Please complete your doctor registration to view appointments.</p>
                    <button class="btn" onclick="showRegistrationSection()">Complete Registration</button>
                </div>
            `;
            return;
        }
        
        const doctorAppointments = await apiService.getDoctorAppointments(currentDoctor._id);
        
        if (doctorAppointments.length === 0) {
            appointmentsList.innerHTML = `
                <div class="no-appointments">
                    <i class="fas fa-calendar-times fa-3x"></i>
                    <h3>No appointments found</h3>
                    <p>You don't have any appointments yet.</p>
                </div>
            `;
            return;
        }
        
        doctorAppointments.forEach(appointment => {
            const appointmentCard = document.createElement('div');
            appointmentCard.className = 'appointment-card';
            
            const statusClass = `status-${appointment.status}`;
            
            appointmentCard.innerHTML = `
                <div class="appointment-header">
                    <div class="appointment-doctor">
                        Patient: ${appointment.patientName}
                    </div>
                    <span class="appointment-status ${statusClass}">${appointment.status}</span>
                </div>
                <div class="appointment-details">
                    <div>
                        <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${appointment.time} (${appointment.duration} minutes)</p>
                    </div>
                    <div>
                        <p><strong>Reason:</strong> ${appointment.reason}</p>
                        <p><strong>Booked on:</strong> ${new Date(appointment.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="appointment-actions">
                    ${appointment.status === 'pending' 
                        ? `<button class="btn btn-small btn-success confirm-appointment" data-id="${appointment._id}">Confirm</button>` 
                        : ''}
                    <button class="btn btn-small btn-danger cancel-appointment" data-id="${appointment._id}">
                        ${appointment.status === 'cancelled' ? 'Remove' : 'Cancel'}
                    </button>
                </div>
            `;
            appointmentsList.appendChild(appointmentCard);
        });
        
        // Add event listeners for appointment actions
        document.querySelectorAll('.confirm-appointment').forEach(button => {
            button.addEventListener('click', (e) => {
                const appointmentId = e.target.getAttribute('data-id');
                updateAppointmentStatus(appointmentId, 'confirmed');
            });
        });
        
        document.querySelectorAll('.cancel-appointment').forEach(button => {
            button.addEventListener('click', (e) => {
                const appointmentId = e.target.getAttribute('data-id');
                const appointment = doctorAppointments.find(apt => apt._id === appointmentId);
                
                if (appointment.status === 'cancelled') {
                    // Remove cancelled appointment
                    removeAppointment(appointmentId);
                } else {
                    // Cancel appointment
                    updateAppointmentStatus(appointmentId, 'cancelled');
                }
            });
        });
    } catch (error) {
        console.error('Load appointments error:', error);
        appointmentsList.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <h3>Error loading appointments</h3>
                <p>Failed to load appointments. Please try again later.</p>
            </div>
        `;
    }
}

// Function to update appointment status
async function updateAppointmentStatus(appointmentId, status) {
    try {
        await apiService.updateAppointment(appointmentId, status);
        
        // Refresh display
        displayAppointments();
        
        alert(`Appointment ${status} successfully!`);
    } catch (error) {
        alert('Failed to update appointment. Please try again.');
        console.error('Update appointment error:', error);
    }
}

// Function to remove appointment
async function removeAppointment(appointmentId) {
    try {
        await apiService.deleteAppointment(appointmentId);
        
        // Refresh display
        displayAppointments();
        
        alert('Appointment removed successfully!');
    } catch (error) {
        alert('Failed to remove appointment. Please try again.');
        console.error('Remove appointment error:', error);
    }
}