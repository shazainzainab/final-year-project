import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import destinationsRouter from './routes/destinations.js';
import recommendRouter from './routes/recommend.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/api/destinations', destinationsRouter);
app.use('/api/recommend', recommendRouter);

app.get('/', (req, res) => {
  res.send('Travel recommendation API running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});