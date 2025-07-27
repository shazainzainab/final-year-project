import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './models/Destination.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await Destination.deleteMany({});

  const rome = {
    name: 'Rome',
    country: 'Italy',
    description: 'Rome, the capital city of Italy, is known for its rich history, stunning architecture, and vibrant street life.',
    image: 'https://images.unsplash.com/photo-1526483360412-f4dbaf036963',
    coords: { lat: 41.9028, lon: 12.4964 },
    hotels: [
      { name: 'Hotel Roma', price: 120, link: 'https://example.com/hotel-roma' },
      { name: 'Colosseum Inn', price: 150, link: 'https://example.com/colosseum-inn' }
    ]
  };

  await Destination.create(rome);
  console.log('Seed data inserted');
  mongoose.disconnect();
};

seed();