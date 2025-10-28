// Symptom to specialty mapping
const symptomMapping = {
    'fever': ['General Practice', 'Pediatrics'],
    'cold': ['General Practice', 'Pediatrics'],
    'cough': ['General Practice', 'Pediatrics', 'Pulmonology'],
    'chest pain': ['Cardiology', 'General Practice'],
    'heart': ['Cardiology'],
    'lung': ['Pulmonology', 'General Practice'],
    'lungs': ['Pulmonology', 'General Practice'],
    'breathing': ['Pulmonology', 'General Practice'],
    'headache': ['General Practice', 'Neurology'],
    'sore throat': ['General Practice', 'Pediatrics', 'ENT'],
    'flu': ['General Practice', 'Pediatrics'],
    'fatigue': ['General Practice', 'Endocrinology'],
    'skin': ['Dermatology'],
    'rash': ['Dermatology'],
    'acne': ['Dermatology'],
    'bone': ['Orthopedics'],
    'joint': ['Orthopedics'],
    'muscle': ['Orthopedics'],
    'child': ['Pediatrics'],
    'children': ['Pediatrics'],
    'kid': ['Pediatrics'],
    'stomach': ['Gastroenterology', 'General Practice'],
    'digestive': ['Gastroenterology'],
    'mental': ['Psychiatry'],
    'depression': ['Psychiatry'],
    'anxiety': ['Psychiatry'],
    'brain': ['Neurology'],
    'nerve': ['Neurology']
};

// Helper function to generate random coordinates
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Sample data initialization
const sampleDoctors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "General Practice",
        email: "s.johnson@hospital.com",
        phone: "+1 (555) 123-4567",
        address: "123 Medical Center Dr",
        city: "New York",
        bio: "Experienced general practitioner with 10+ years of experience...",
        education: "MD from Harvard Medical School",
        experience: 10,
        rating: 4.8,
        reviews: []
    },
    {
        id: 2, 
        name: "Dr. Michael Chen",
        specialty: "Cardiology",
        email: "m.chen@cardiac.com",
        phone: "+1 (555) 234-5678",
        address: "456 Heart Center Blvd",
        city: "New York",
        bio: "Cardiologist specializing in heart disease prevention...",
        education: "MD from Johns Hopkins University",
        experience: 15,
        rating: 4.9,
        reviews: []
    }
    // Add more sample doctors as needed
];

// Initialize data if empty
function initializeSampleData() {
    if (!localStorage.getItem('medifind_doctors') || JSON.parse(localStorage.getItem('medifind_doctors')).length === 0) {
        localStorage.setItem('medifind_doctors', JSON.stringify(sampleDoctors));
    }
    
    // Initialize other data stores
    if (!localStorage.getItem('medifind_users')) {
        localStorage.setItem('medifind_users', JSON.stringify([]));
    }
    if (!localStorage.getItem('medifind_appointments')) {
        localStorage.setItem('medifind_appointments', JSON.stringify([]));
    }
    if (!localStorage.getItem('medifind_reviews')) {
        localStorage.setItem('medifind_reviews', JSON.stringify([]));
    }
}

// Call this when your app loads
initializeSampleData();