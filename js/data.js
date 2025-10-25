// Sample doctor data with coordinates
let doctors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        email: "s.johnson@medifind.com",
        phone: "+1 (555) 123-4567",
        address: "123 Health St, Medical District",
        city: "New York",
        lat: 40.7128,
        lng: -74.0060,
        bio: "Board-certified cardiologist with 15 years of experience specializing in heart disease prevention and treatment.",
        education: "MD from Harvard Medical School, Fellowship in Cardiology at Johns Hopkins",
        experience: 15,
        rating: 4.8,
        reviewCount: 127
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Dermatology",
        email: "m.chen@medifind.com",
        phone: "+1 (555) 234-5678",
        address: "456 Skin Care Ave, Dermatology Center",
        city: "Los Angeles",
        lat: 34.0522,
        lng: -118.2437,
        bio: "Expert dermatologist focusing on skin cancer prevention and cosmetic dermatology.",
        education: "MD from Stanford University, Dermatology Residency at UCLA",
        experience: 12,
        rating: 4.9,
        reviewCount: 89
    },
    {
        id: 3,
        name: "Dr. Emily Rodriguez",
        specialty: "Pediatrics",
        email: "e.rodriguez@medifind.com",
        phone: "+1 (555) 345-6789",
        address: "789 Children's Way, Pediatric Center",
        city: "Chicago",
        lat: 41.8781,
        lng: -87.6298,
        bio: "Pediatrician dedicated to providing comprehensive care for children from infancy through adolescence.",
        education: "MD from University of Chicago, Pediatrics Residency at Children's Hospital",
        experience: 10,
        rating: 4.7,
        reviewCount: 203
    },
    {
        id: 4,
        name: "Dr. James Wilson",
        specialty: "Orthopedics",
        email: "j.wilson@medifind.com",
        phone: "+1 (555) 456-7890",
        address: "321 Bone & Joint Blvd, Orthopedic Institute",
        city: "Houston",
        lat: 29.7604,
        lng: -95.3698,
        bio: "Orthopedic surgeon specializing in sports injuries and joint replacement surgeries.",
        education: "MD from Baylor College of Medicine, Orthopedic Surgery Fellowship at Mayo Clinic",
        experience: 18,
        rating: 4.6,
        reviewCount: 156
    },
    {
        id: 5,
        name: "Dr. Robert Miller",
        specialty: "General Practice",
        email: "r.miller@medifind.com",
        phone: "+1 (555) 567-8901",
        address: "555 Wellness Blvd, Family Health Center",
        city: "New York",
        lat: 40.7505,
        lng: -73.9934,
        bio: "Experienced general practitioner with expertise in treating common illnesses like fever, cold, cough, and flu.",
        education: "MD from Columbia University, Family Medicine Residency at NYU",
        experience: 14,
        rating: 4.7,
        reviewCount: 189
    },
    {
        id: 6,
        name: "Dr. Lisa Thompson",
        specialty: "General Practice",
        email: "l.thompson@medifind.com",
        phone: "+1 (555) 678-9012",
        address: "777 Primary Care Lane, Community Clinic",
        city: "Los Angeles",
        lat: 34.0635,
        lng: -118.2780,
        bio: "Compassionate general practitioner specializing in common ailments and preventive care.",
        education: "MD from UCLA, Family Medicine Residency at Cedars-Sinai",
        experience: 11,
        rating: 4.8,
        reviewCount: 167
    },
    {
        id: 7,
        name: "Dr. David Patel",
        specialty: "General Practice",
        email: "d.patel@medifind.com",
        phone: "+1 (555) 789-0123",
        address: "888 Health Ave, Primary Care Center",
        city: "Chicago",
        lat: 41.8954,
        lng: -87.6253,
        bio: "Dedicated general practitioner with focus on comprehensive care for common symptoms and illnesses.",
        education: "MD from University of Illinois, Family Medicine Residency at Northwestern",
        experience: 9,
        rating: 4.6,
        reviewCount: 134
    }
];

// Enhanced symptom to specialty mapping
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

// Sample reviews data
let reviews = [
    { doctorId: 1, reviewer: "John Doe", rating: 5, comment: "Dr. Johnson is exceptional. She took time to explain everything clearly.", date: "2023-05-15" },
    { doctorId: 1, reviewer: "Jane Smith", rating: 4, comment: "Very professional and knowledgeable. Wait time was a bit long though.", date: "2023-04-22" },
    { doctorId: 2, reviewer: "Robert Brown", rating: 5, comment: "Dr. Chen solved a skin issue I've had for years. Highly recommend!", date: "2023-06-10" },
    { doctorId: 3, reviewer: "Maria Garcia", rating: 5, comment: "My kids love Dr. Rodriguez. She's patient and great with children.", date: "2023-05-30" },
    { doctorId: 4, reviewer: "David Lee", rating: 4, comment: "Successful knee surgery and good follow-up care.", date: "2023-04-05" },
    { doctorId: 5, reviewer: "Susan Wilson", rating: 5, comment: "Dr. Miller quickly diagnosed my flu and provided effective treatment.", date: "2023-06-15" },
    { doctorId: 5, reviewer: "Thomas Reed", rating: 4, comment: "Good experience for my fever and cold symptoms.", date: "2023-05-20" },
    { doctorId: 6, reviewer: "Jennifer Kim", rating: 5, comment: "Dr. Thompson is excellent for common illnesses. Very thorough.", date: "2023-06-12" },
    { doctorId: 7, reviewer: "Michael Brown", rating: 4, comment: "Helpful for my persistent cough. Good follow-up care.", date: "2023-05-28" }
];

// User management
let users = [
    { id: 1, name: "John Customer", email: "customer@example.com", password: "password", type: "customer" },
    { id: 2, name: "Dr. Sarah Johnson", email: "s.johnson@medifind.com", password: "password", type: "doctor" }
];

// New appointments array
let appointments = [];

// Helper function to generate random coordinates
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}