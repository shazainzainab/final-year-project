const { sql, poolPromise } = require('../db');

// POST /api/recommendations
async function getRecommendations(req, res) {
  const {
    destination, // string
    startDate, // YYYY-MM-DD
    days, // number
    budget, // low | medium | high
    travelType, // solo | family | couple | friend
    activities, // array of strings
    foodPreference, // halal | vegetarian | non veg
    additional // optional string
  } = req.body;

  try {
    const pool = await poolPromise;

    // 1. Fetch destination basic info
    const cityResult = await pool.request()
      .input('destination', sql.VarChar, destination)
      .query(`SELECT TOP 1 * FROM Cities WHERE Name = @destination`);

    if (!cityResult.recordset.length) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    const city = cityResult.recordset[0];

    // 2. Hotels filtered by budget and destination
    const hotelsResult = await pool.request()
      .input('cityId', sql.Int, city.Id)
      .input('budget', sql.VarChar, budget)
      .query(`
        SELECT TOP 10 *
        FROM Hotels
        WHERE CityId = @cityId AND BudgetCategory = @budget
        ORDER BY Rating DESC;
      `);

    // 3. Attractions filtered by preferred activities
    // Assuming there is a mapping table Attractions with Category field
    let placeholder = '';
    let params = {};
    if (Array.isArray(activities) && activities.length) {
      placeholder = activities.map((_, idx) => `@cat${idx}`).join(',');
      activities.forEach((a, idx) => (params[`cat${idx}`] = a));
    }

    let attractionsQuery = `SELECT * FROM AttractionPlaces WHERE CityId = @cityId`;
    if (placeholder) attractionsQuery += ` AND Category IN (${placeholder})`;

    let attractionsRequest = pool.request().input('cityId', sql.Int, city.Id);
    Object.keys(params).forEach(key => {
      attractionsRequest = attractionsRequest.input(key, sql.VarChar, params[key]);
    });

    const attractionsResult = await attractionsRequest.query(attractionsQuery);

    // 4. Meals / Restaurants based on food preference
    const restaurantsResult = await pool.request()
      .input('cityId', sql.Int, city.Id)
      .input('foodPref', sql.VarChar, foodPreference)
      .query(`
        SELECT * FROM Restaurants
        WHERE CityId = @cityId AND FoodType = @foodPref;
      `);

    // 5. Simple trip plan generator (divide attractions across days)
    const dailyPlan = [];
    const attractions = attractionsResult.recordset;
    const dailyCount = Math.ceil(attractions.length / days);
    for (let i = 0; i < days; i++) {
      dailyPlan.push({
        day: i + 1,
        date: new Date(new Date(startDate).getTime() + i * 86400000),
        activities: attractions.slice(i * dailyCount, (i + 1) * dailyCount)
      });
    }

    res.json({
      destination: city,
      hotels: hotelsResult.recordset,
      restaurants: restaurantsResult.recordset,
      plan: dailyPlan,
      meta: {
        startDate,
        days,
        budget,
        travelType,
        additional
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /api/destinations
async function getDestinations(_req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Cities');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /api/destinations/:id/hotels
async function getHotelsByDestination(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('cityId', sql.Int, id)
      .query('SELECT * FROM Hotels WHERE CityId = @cityId');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  getRecommendations,
  getDestinations,
  getHotelsByDestination
};