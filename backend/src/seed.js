/**
 * AERIX AI - Database Seed Script
 * Run: node src/seed.js
 * Seeds initial workshops, products, and an admin user
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Workshop = require('./models/Workshop');
const Product = require('./models/Product');

const workshops = [
  {
    title: 'AI & Smart Technology Workshop',
    duration: '2 Days',
    description: 'AI basics, real-life applications, interactive demonstrations, and hands-on experiments for school students.',
    targetAudience: 'Class 6–12',
    price: 15000,
    workshopType: 'ai_tech',
    features: ['AI Basics', 'Live Demo', 'Hands-on Experiments', 'Real-life Applications'],
    isActive: true
  },
  {
    title: 'Women Safety Tech Workshop',
    duration: '1 Day',
    description: 'Smart safety devices, emergency response systems, live NAARIX band demo and safety awareness sessions.',
    targetAudience: 'All Ages',
    price: 8000,
    workshopType: 'safety',
    features: ['Device Demo', 'Safety Awareness', 'NAARIX Band Live Demo', 'Emergency Response'],
    isActive: true
  },
  {
    title: 'AI Assistant & Chatbot Development',
    duration: '3 Days',
    description: 'AI basics, NLP introduction, building simple chatbot assistants — no prior coding experience needed.',
    targetAudience: 'Class 8–12',
    price: 20000,
    workshopType: 'chatbot',
    features: ['AI Basics', 'NLP Introduction', 'Build a Chatbot', 'No Coding Required'],
    isActive: true
  },
  {
    title: 'Aerospace & Innovation Workshop',
    duration: '3 Days',
    description: 'Rocket science basics, innovation thinking methodology, hands-on model-building and aerospace careers.',
    targetAudience: 'Class 6–12',
    price: 18000,
    workshopType: 'aerospace',
    features: ['Rocket Science Basics', 'Innovation Methodology', 'Model Building', 'Aerospace Careers'],
    isActive: true
  }
];

const products = [
  {
    name: 'AERIX AI Smart School System',
    category: 'education',
    badge: 'EDUCATION',
    shortDesc: 'AI-powered platform for schools — smart learning, teacher assistance & real-time performance tracking.',
    fullDesc: 'A comprehensive AI-driven school management and learning platform that transforms how schools operate. Includes smart dashboards for teachers, personalized learning paths for students, and real-time performance analytics.',
    priceRange: 'Contact for pricing',
    ctaType: 'demo',
    features: ['Smart Learning Paths', 'Teacher Assistance AI', 'Real-time Performance Tracking', 'Student Analytics'],
    isActive: true
  },
  {
    name: 'AERIXA AI Educational Device',
    category: 'edtech_device',
    badge: 'EDTECH DEVICE',
    shortDesc: 'Compact AI companion for instant student queries and personalized learning experiences.',
    fullDesc: 'A portable, affordable AI-powered device designed for classrooms. Students can ask questions, get instant explanations, and receive personalized study support — even without internet connectivity.',
    priceRange: 'Get Quote',
    ctaType: 'quote',
    features: ['Offline Capable', 'Instant Q&A', 'Personalized Learning', 'Classroom Ready'],
    isActive: true
  },
  {
    name: 'NAARIX AI Smart Safety Band',
    category: 'safety',
    badge: 'SAFETY WEARABLE',
    shortDesc: 'Wearable safety device for women with real-time emergency detection and instant SOS alerts.',
    fullDesc: 'India\'s most affordable AI-powered women\'s safety wearable. Features sub-5-second emergency detection, instant SOS alerts to family and authorities, real-time GPS tracking, and a discreet panic button.',
    priceRange: '₹1,999 – ₹2,999',
    ctaType: 'preorder',
    features: ['Sub-5sec Emergency Detection', 'Instant SOS Alerts', 'GPS Tracking', 'Discreet Panic Button'],
    isActive: true
  },
  {
    name: 'AI Assistant System',
    category: 'ai_assistant',
    badge: 'AI ASSISTANT',
    shortDesc: 'Conversational AI for fast, context-aware responses — helping businesses and institutions instantly.',
    fullDesc: 'A customizable conversational AI system for businesses, schools, and institutions. Handles FAQs, bookings, product queries, and customer support 24/7 with human-like intelligence.',
    priceRange: 'Contact for pricing',
    ctaType: 'demo',
    features: ['24/7 Availability', 'Custom Knowledge Base', 'Multi-language Support', 'Analytics Dashboard'],
    isActive: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Workshop.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing workshops and products');

    // Seed workshops
    await Workshop.insertMany(workshops);
    console.log('✅ Seeded 4 workshops');

    // Seed products
    await Product.insertMany(products);
    console.log('✅ Seeded 4 products');

    // Create admin user (if not exists)
    const existingAdmin = await User.findOne({ email: 'aerixteam@gmail.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Dr. Kamal Sharma',
        email: 'aerixteam@gmail.com',
        passwordHash: 'AerixAdmin@2026',  // Change this after first login!
        role: 'admin',
        phone: '+91 9358855881'
      });
      console.log('✅ Admin user created: aerixteam@gmail.com / AerixAdmin@2026');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🚀 AERIX AI database seeded successfully!');
    console.log('⚠️  Remember to change the admin password after first login!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
