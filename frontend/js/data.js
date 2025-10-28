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