require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const sampleDestinations = [
  {
    name: "Rome",
    country: "Italy",
    coordinates: {
      lat: 41.9028,
      lng: 12.4964
    },
    description: "The Eternal City, Rome is a captivating blend of ancient history and modern Italian culture. Home to iconic landmarks like the Colosseum, Vatican City, and Pantheon, Rome offers an unparalleled journey through time with world-class cuisine and vibrant street life.",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1896&q=80",
    averageCosts: {
      accommodation: {
        low: 50,
        medium: 120,
        high: 250
      },
      food: {
        low: 25,
        medium: 45,
        high: 80
      },
      transport: {
        low: 15,
        medium: 25,
        high: 40
      }
    },
    hotels: [
      {
        name: "Hotel Artemide",
        price: 180,
        rating: 4.5,
        link: "https://www.booking.com/hotel/it/artemide.html"
      },
      {
        name: "The First Roma Dolce",
        price: 220,
        rating: 4.7,
        link: "https://www.booking.com/hotel/it/the-first-roma-dolce.html"
      },
      {
        name: "Hotel Sonya",
        price: 85,
        rating: 4.2,
        link: "https://www.booking.com/hotel/it/sonya.html"
      }
    ],
    activities: [
      {
        name: "Visit the Colosseum",
        type: "city view",
        description: "Explore the iconic ancient amphitheater",
        estimatedCost: 25
      },
      {
        name: "Vatican Museums Tour",
        type: "city view",
        description: "Visit the Sistine Chapel and St. Peter's Basilica",
        estimatedCost: 35
      },
      {
        name: "Trastevere Food Tour",
        type: "food street",
        description: "Experience authentic Roman cuisine",
        estimatedCost: 45
      },
      {
        name: "Roman Forum Exploration",
        type: "outdoor sites",
        description: "Walk through ancient Roman ruins",
        estimatedCost: 20
      },
      {
        name: "Pantheon Visit",
        type: "city view",
        description: "Marvel at the ancient Roman temple",
        estimatedCost: 0
      },
      {
        name: "Testaccio Market",
        type: "shopping malls",
        description: "Local market for food and shopping",
        estimatedCost: 30
      }
    ],
    itinerary: [
      {
        day: 1,
        activities: ["Colosseum Tour", "Roman Forum", "Palatine Hill"],
        description: "Explore Ancient Rome's most iconic sites"
      },
      {
        day: 2,
        activities: ["Vatican Museums", "Sistine Chapel", "St. Peter's Basilica"],
        description: "Discover Vatican City's treasures"
      },
      {
        day: 3,
        activities: ["Pantheon", "Trevi Fountain", "Spanish Steps"],
        description: "Visit Rome's baroque masterpieces"
      }
    ]
  },
  {
    name: "Pisa",
    country: "Italy",
    coordinates: {
      lat: 43.7228,
      lng: 10.4017
    },
    description: "Famous for its iconic Leaning Tower, Pisa is a charming Tuscan city rich in medieval architecture. Beyond the tower, explore the beautiful Piazza dei Miracoli, historic university, and riverside views along the Arno.",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    averageCosts: {
      accommodation: {
        low: 40,
        medium: 90,
        high: 180
      },
      food: {
        low: 20,
        medium: 35,
        high: 60
      },
      transport: {
        low: 10,
        medium: 20,
        high: 30
      }
    },
    hotels: [
      {
        name: "Hotel Bologna",
        price: 95,
        rating: 4.3,
        link: "https://www.booking.com/hotel/it/bologna-pisa.html"
      },
      {
        name: "Grand Hotel Duomo",
        price: 160,
        rating: 4.6,
        link: "https://www.booking.com/hotel/it/grand-duomo-pisa.html"
      }
    ],
    activities: [
      {
        name: "Leaning Tower of Pisa",
        type: "city view",
        description: "Climb the famous tilted tower",
        estimatedCost: 20
      },
      {
        name: "Pisa Cathedral",
        type: "city view",
        description: "Visit the beautiful Duomo",
        estimatedCost: 10
      },
      {
        name: "Arno River Walk",
        type: "river",
        description: "Stroll along the historic river",
        estimatedCost: 0
      },
      {
        name: "Local Market Visit",
        type: "food street",
        description: "Experience local Tuscan cuisine",
        estimatedCost: 25
      }
    ],
    itinerary: [
      {
        day: 1,
        activities: ["Leaning Tower", "Cathedral", "Baptistery"],
        description: "Explore the famous Piazza dei Miracoli"
      },
      {
        day: 2,
        activities: ["Arno River Walk", "Historic Center", "Local Markets"],
        description: "Discover Pisa's charming streets and culture"
      }
    ]
  },
  {
    name: "Venice",
    country: "Italy",
    coordinates: {
      lat: 45.4408,
      lng: 12.3155
    },
    description: "The floating city of Venice is a unique masterpiece built on water. Navigate through romantic canals, visit stunning palaces, and experience the magic of gondola rides through this UNESCO World Heritage site.",
    imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2083&q=80",
    averageCosts: {
      accommodation: {
        low: 70,
        medium: 150,
        high: 300
      },
      food: {
        low: 30,
        medium: 55,
        high: 90
      },
      transport: {
        low: 20,
        medium: 35,
        high: 60
      }
    },
    hotels: [
      {
        name: "Hotel Danieli",
        price: 450,
        rating: 4.8,
        link: "https://www.booking.com/hotel/it/danieli-venezia.html"
      },
      {
        name: "Pensione Guerrato",
        price: 120,
        rating: 4.4,
        link: "https://www.booking.com/hotel/it/pensione-guerrato.html"
      }
    ],
    activities: [
      {
        name: "Gondola Ride",
        type: "river",
        description: "Romantic boat ride through canals",
        estimatedCost: 80
      },
      {
        name: "St. Mark's Basilica",
        type: "city view",
        description: "Visit the stunning Byzantine cathedral",
        estimatedCost: 15
      },
      {
        name: "Doge's Palace",
        type: "city view",
        description: "Explore the former residence of Venetian rulers",
        estimatedCost: 25
      },
      {
        name: "Rialto Market",
        type: "food street",
        description: "Experience Venice's famous food market",
        estimatedCost: 35
      },
      {
        name: "Murano Glass Tour",
        type: "outdoor sites",
        description: "Visit the famous glass-making island",
        estimatedCost: 40
      }
    ],
    itinerary: [
      {
        day: 1,
        activities: ["St. Mark's Square", "Basilica", "Doge's Palace"],
        description: "Explore Venice's main attractions"
      },
      {
        day: 2,
        activities: ["Gondola Ride", "Rialto Bridge", "Grand Canal"],
        description: "Experience Venice from the water"
      },
      {
        day: 3,
        activities: ["Murano Island", "Burano Island", "Glass Workshop"],
        description: "Visit the famous islands and see traditional crafts"
      }
    ]
  },
  {
    name: "Florence",
    country: "Italy",
    coordinates: {
      lat: 43.7696,
      lng: 11.2558
    },
    description: "The cradle of the Renaissance, Florence is an open-air museum filled with masterpieces. From Michelangelo's David to the stunning Duomo, this Tuscan capital offers unparalleled art, architecture, and culture.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    averageCosts: {
      accommodation: {
        low: 45,
        medium: 110,
        high: 220
      },
      food: {
        low: 22,
        medium: 40,
        high: 70
      },
      transport: {
        low: 12,
        medium: 22,
        high: 35
      }
    },
    hotels: [
      {
        name: "Hotel Davanzati",
        price: 140,
        rating: 4.5,
        link: "https://www.booking.com/hotel/it/davanzati.html"
      },
      {
        name: "Villa San Michele",
        price: 380,
        rating: 4.9,
        link: "https://www.booking.com/hotel/it/villa-san-michele-fiesole.html"
      }
    ],
    activities: [
      {
        name: "Uffizi Gallery",
        type: "city view",
        description: "World's greatest Renaissance art collection",
        estimatedCost: 25
      },
      {
        name: "Duomo Cathedral",
        type: "city view",
        description: "Climb the iconic dome for city views",
        estimatedCost: 18
      },
      {
        name: "Ponte Vecchio",
        type: "shopping malls",
        description: "Historic bridge with jewelry shops",
        estimatedCost: 0
      },
      {
        name: "Oltrarno Food Tour",
        type: "food street",
        description: "Taste authentic Florentine cuisine",
        estimatedCost: 55
      },
      {
        name: "Boboli Gardens",
        type: "outdoor sites",
        description: "Beautiful Renaissance gardens",
        estimatedCost: 12
      }
    ],
    itinerary: [
      {
        day: 1,
        activities: ["Duomo", "Uffizi Gallery", "Ponte Vecchio"],
        description: "Florence's Renaissance highlights"
      },
      {
        day: 2,
        activities: ["Accademia Gallery", "San Lorenzo Market", "Oltrarno District"],
        description: "Art and local culture immersion"
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');

    // Insert sample destinations
    const insertedDestinations = await Destination.insertMany(sampleDestinations);
    console.log(`Inserted ${insertedDestinations.length} destinations:`);
    insertedDestinations.forEach(dest => {
      console.log(`- ${dest.name}, ${dest.country}`);
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();