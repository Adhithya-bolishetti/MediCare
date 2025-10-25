// Function to open booking modal
function openBookingModal(doctorId) {
    if (!currentUser) {
        alert('Please log in to book an appointment.');
        authModal.style.display = 'flex';
        return;
    }
    
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;
    
    currentDoctorId = doctorId;
    bookingDoctor.value = `${doctor.name} - ${doctor.specialty}`;
    
    // Reset form
    bookingDate.value = '';
    bookingTime.innerHTML = '<option value="">Select Time</option>';
    bookingReason.value = '';
    slotError.style.display = 'none';
    availableSlots.style.display = 'none';
    
    bookingModal.style.display = 'flex';
}

// Function to update available time slots based on selected date
function updateAvailableSlots(doctorId, date) {
    // Generate time slots from 9 AM to 5 PM in 30-minute intervals
    const timeSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeSlots.push(timeString);
        }
    }
    
    // Filter out booked slots
    const bookedSlots = appointments
        .filter(apt => apt.doctorId === doctorId && apt.date === date && apt.status !== 'cancelled')
        .map(apt => apt.time);
    
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
}

// Function to book appointment
function bookAppointment() {
    const doctorId = currentDoctorId;
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (!doctor) return;
    
    const date = bookingDate.value;
    const time = bookingTime.value;
    const reason = bookingReason.value;
    
    if (!date || !time) {
        alert('Please select both date and time for your appointment.');
        return;
    }
    
    // Check if the selected slot is available
    const isSlotBooked = appointments.some(apt => 
        apt.doctorId === doctorId && 
        apt.date === date && 
        apt.time === time && 
        apt.status !== 'cancelled'
    );
    
    if (isSlotBooked) {
        slotError.style.display = 'block';
        return;
    }
    
    const appointment = {
        id: appointments.length + 1,
        doctorId: doctorId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        patientId: currentUser.id,
        patientName: currentUser.name,
        date: date,
        time: time,
        reason: reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
        duration: 30 // 30 minutes
    };
    
    appointments.push(appointment);
    
    // Save to localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    alert('Appointment booked successfully!');
    bookingModal.style.display = 'none';
    
    // If on appointments page (for doctors), refresh the list
    if (appointmentsSection.style.display === 'block' && currentUser.type === 'doctor') {
        displayAppointments();
    }
}

// FIXED: Function to display appointments (only for doctors)
function displayAppointments() {
    appointmentsList.innerHTML = '';
    
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
        appointments = JSON.parse(savedAppointments);
    }
    
    // Find the current doctor's ID by matching email
    let currentDoctorId = null;
    if (currentUser && currentUser.type === 'doctor') {
        const currentDoctor = doctors.find(d => d.email === currentUser.email);
        if (currentDoctor) {
            currentDoctorId = currentDoctor.id;
        } else {
            // If no match by email, try to match by name
            const doctorByName = doctors.find(d => d.name === currentUser.name);
            if (doctorByName) {
                currentDoctorId = doctorByName.id;
            }
        }
    }
    
    // Filter appointments for the current doctor
    let doctorAppointments = [];
    if (currentDoctorId) {
        doctorAppointments = appointments.filter(apt => apt.doctorId === currentDoctorId);
    } else {
        // If we still can't find the doctor ID, show a message
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
    
    // Sort appointments by date and time (newest first)
    doctorAppointments.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB - dateA;
    });
    
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
                    ? `<button class="btn btn-small btn-success confirm-appointment" data-id="${appointment.id}">Confirm</button>` 
                    : ''}
                <button class="btn btn-small btn-danger cancel-appointment" data-id="${appointment.id}">
                    ${appointment.status === 'cancelled' ? 'Remove' : 'Cancel'}
                </button>
            </div>
        `;
        appointmentsList.appendChild(appointmentCard);
    });
    
    // Add event listeners for appointment actions
    document.querySelectorAll('.confirm-appointment').forEach(button => {
        button.addEventListener('click', (e) => {
            const appointmentId = parseInt(e.target.getAttribute('data-id'));
            updateAppointmentStatus(appointmentId, 'confirmed');
        });
    });
    
    document.querySelectorAll('.cancel-appointment').forEach(button => {
        button.addEventListener('click', (e) => {
            const appointmentId = parseInt(e.target.getAttribute('data-id'));
            const appointment = appointments.find(apt => apt.id === appointmentId);
            
            if (appointment.status === 'cancelled') {
                // Remove cancelled appointment
                removeAppointment(appointmentId);
            } else {
                // Cancel appointment
                updateAppointmentStatus(appointmentId, 'cancelled');
            }
        });
    });
}

// Function to update appointment status
function updateAppointmentStatus(appointmentId, status) {
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex].status = status;
        
        // Save to localStorage
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        // Refresh display
        displayAppointments();
        
        alert(`Appointment ${status} successfully!`);
    }
}

// Function to remove appointment
function removeAppointment(appointmentId) {
    appointments = appointments.filter(apt => apt.id !== appointmentId);
    
    // Save to localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Refresh display
    displayAppointments();
    
    alert('Appointment removed successfully!');
}