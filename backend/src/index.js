require('dotenv').config();
const express = require('express');
const cors = require('cors');

const recommendationRoutes = require('./routes/recommendations');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', recommendationRoutes);

// Health check
app.get('/', (_, res) => res.send({ status: 'ViaItalia API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));