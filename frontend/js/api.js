// API service functions
const API_BASE_URL = 'http://localhost:3000/api';

const apiService = {
    // Auth endpoints
    async signup(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    },

    // Doctor endpoints
    async getDoctors() {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        return await response.json();
    },

    async searchDoctors(params) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/doctors/search?${queryString}`);
        return await response.json();
    },

    async registerDoctor(doctorData) {
        const response = await fetch(`${API_BASE_URL}/doctors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doctorData)
        });
        return await response.json();
    },

    async getDoctorById(id) {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
        return await response.json();
    },

    // Review endpoints
    async getReviews(doctorId) {
        const response = await fetch(`${API_BASE_URL}/reviews/doctor/${doctorId}`);
        return await response.json();
    },

    async addReview(reviewData) {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        return await response.json();
    },

    // Appointment endpoints
    async getDoctorAppointments(doctorId) {
        const response = await fetch(`${API_BASE_URL}/appointments/doctor/${doctorId}`);
        return await response.json();
    },

    async getUserAppointments(userId) {
        const response = await fetch(`${API_BASE_URL}/appointments/user/${userId}`);
        return await response.json();
    },

    async bookAppointment(appointmentData) {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });
        return await response.json();
    },

    async updateAppointment(id, status) {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return await response.json();
    },

    async deleteAppointment(id) {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }
};