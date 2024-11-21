require('dotenv').config();
const mongoose = require('mongoose');
const College = require('../models/College');
const Branch = require('../models/Branch');

const colleges = [
  {
    name: 'IIT Bombay',
    location: 'Mumbai, Maharashtra',
    ranking: 1,
    established: 1958,
    website: 'https://www.iitb.ac.in'
  },
  {
    name: 'IIT Delhi',
    location: 'New Delhi',
    ranking: 2,
    established: 1961,
    website: 'https://www.iitd.ac.in'
  },
  {
    name: 'BITS Pilani',
    location: 'Pilani, Rajasthan',
    ranking: 3,
    established: 1964,
    website: 'https://www.bits-pilani.ac.in'
  }
];

const branches = [
  {
    name: 'Computer Science and Engineering',
    description: 'Study of computer systems, algorithms, and software development',
    risks: [
      'High competition in the job market',
      'Rapid technological changes requiring constant learning',
      'Potential for work-related stress and burnout',
      'Sedentary work environment'
    ],
    advantages: [
      'High salary potential',
      'Excellent job opportunities',
      'Global career prospects',
      'Innovation opportunities',
      'Remote work flexibility'
    ],
    careerProspects: [
      'Software Engineer',
      'Data Scientist',
      'AI/ML Engineer',
      'System Architect',
      'Tech Lead'
    ],
    averageSalary: 2000000,
    courseDuration: 4,
    eligibilityCriteria: 'JEE Advanced qualification with strong mathematics background'
  },
  {
    name: 'Electrical Engineering',
    description: 'Study of electrical systems, electronics, and power systems',
    risks: [
      'Complex and challenging coursework',
      'Potential workplace hazards',
      'Need for continuous skill updating',
      'Project deadline pressures'
    ],
    advantages: [
      'Diverse career opportunities',
      'Stable job market',
      'Good salary package',
      'Core engineering knowledge',
      'Research opportunities'
    ],
    careerProspects: [
      'Power Systems Engineer',
      'Electronics Designer',
      'Control Systems Engineer',
      'IoT Specialist',
      'Research Scientist'
    ],
    averageSalary: 1500000,
    courseDuration: 4,
    eligibilityCriteria: 'JEE Advanced qualification with strong physics background'
  },
  {
    name: 'Mechanical Engineering',
    description: 'Study of mechanical systems, thermodynamics, and manufacturing',
    risks: [
      'Physically demanding work',
      'Industry cyclical nature',
      'Complex mathematical calculations',
      'Limited remote work options'
    ],
    advantages: [
      'Versatile career options',
      'Strong foundational knowledge',
      'Good salary potential',
      'Entrepreneurship opportunities',
      'Global demand'
    ],
    careerProspects: [
      'Design Engineer',
      'Manufacturing Engineer',
      'Project Manager',
      'Robotics Engineer',
      'Automotive Engineer'
    ],
    averageSalary: 1400000,
    courseDuration: 4,
    eligibilityCriteria: 'JEE Advanced qualification with strong mathematics and physics background'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/career-guidance', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing data
    await College.deleteMany({});
    await Branch.deleteMany({});

    // Insert colleges
    const savedColleges = await College.insertMany(colleges);
    console.log('Colleges seeded successfully');

    // Create branches for each college
    const branchPromises = savedColleges.flatMap(college => 
      branches.map(branch => ({
        ...branch,
        college: college._id
      }))
    );

    await Branch.insertMany(branchPromises);
    console.log('Branches seeded successfully');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
