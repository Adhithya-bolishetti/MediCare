// Function to book appointment
async function bookAppointment() {
    const doctorId = currentDoctorId;
    
    try {
        const doctor = await apiService.getDoctorById(doctorId);
        
        if (!doctor) return;
        
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
        
        await apiService.bookAppointment(appointmentData);
        
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
        alert('Failed to load appointments. Please try again.');
        console.error('Load appointments error:', error);
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