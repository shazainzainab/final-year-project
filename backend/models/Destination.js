import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: String,
  price: Number,
  link: String
});

const destinationSchema = new mongoose.Schema({
  name: String,
  country: String,
  description: String,
  image: String,
  coords: {
    lat: Number,
    lon: Number
  },
  hotels: [hotelSchema]
});

export default mongoose.model('Destination', destinationSchema);