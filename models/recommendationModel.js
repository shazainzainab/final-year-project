const { getPool, sql } = require('../config/db');

class RecommendationModel {
    // Get all available destinations
    static async getDestinations() {
        try {
            const pool = getPool();
            const result = await pool.request()
                .query('SELECT DISTINCT city_name, description FROM Cities ORDER BY city_name');
            return result.recordset;
        } catch (error) {
            throw new Error(`Error fetching destinations: ${error.message}`);
        }
    }

    // Get city details by name
    static async getCityDetails(cityName) {
        try {
            const pool = getPool();
            const result = await pool.request()
                .input('cityName', sql.NVarChar, cityName)
                .query(`
                    SELECT * FROM Cities 
                    WHERE city_name = @cityName
                `);
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error fetching city details: ${error.message}`);
        }
    }

    // Get hotels by city and budget
    static async getHotelsByCity(cityName, budget) {
        try {
            const pool = getPool();
            let budgetFilter = '';

            switch (budget.toLowerCase()) {
                case 'low':
                    budgetFilter = "AND budget = 'low'";
                    break;
                case 'medium':
                    budgetFilter = "AND budget = 'medium'";
                    break;
                case 'high':
                    budgetFilter = "AND budget = 'high'";
                    break;
                default:
                    budgetFilter = '';
            }

            const result = await pool.request()
                .input('cityName', sql.NVarChar, cityName)
                .query(`
                    SELECT h.* FROM Hotels h
                    INNER JOIN Cities c ON h.city_id = c.city_id
                    WHERE c.city_name = @cityName ${budgetFilter}
                `);
            return result.recordset;
        } catch (error) {
            throw new Error(`Error fetching hotels: ${error.message}`);
        }
    }

    // Get attractions based on selected activities
    static async getAttractionsByActivities(cityName, activities) {
        try {
            const pool = getPool();
            let attractions = [];

            const cityResult = await pool.request()
                .input('cityName', sql.NVarChar, cityName)
                .query('SELECT city_id FROM Cities WHERE city_name = @cityName');

            if (cityResult.recordset.length === 0) {
                throw new Error('City not found');
            }

            const cityId = cityResult.recordset[0].city_id;

            if (activities.includes('Beaches')) {
                const beachesResult = await pool.request()
                    .input('cityId', sql.UniqueIdentifier, cityId)
                    .query("SELECT *, 'Beach' as Type FROM Beaches WHERE city_id = @cityId");
                attractions = attractions.concat(beachesResult.recordset);
            }

            if (activities.includes('Shopping mall')) {
                const mallsResult = await pool.request()
                    .input('cityId', sql.UniqueIdentifier, cityId)
                    .query("SELECT *, 'Shopping Mall' as Type FROM ShoppingMalls WHERE city_id = @cityId");
                attractions = attractions.concat(mallsResult.recordset);
            }

            const generalResult = await pool.request()
                .input('cityId', sql.UniqueIdentifier, cityId)
                .query("SELECT *, 'Attraction' as Type FROM AttractionPlaces WHERE city_id = @cityId");
            attractions = attractions.concat(generalResult.recordset);

            return attractions;
        } catch (error) {
            throw new Error(`Error fetching attractions: ${error.message}`);
        }
    }

    // Get restaurants by city and food preference
    static async getRestaurantsByFood(cityName, foodPreference) {
        try {
            const pool = getPool();
            let foodFilter = '';

            switch (foodPreference.toLowerCase()) {
                case 'halal':
                    foodFilter = "AND (CuisineType LIKE '%Halal%' OR CuisineType LIKE '%Middle Eastern%' OR CuisineType LIKE '%Turkish%')";
                    break;
                case 'vegetarian':
                    foodFilter = "AND (CuisineType LIKE '%Vegetarian%' OR CuisineType LIKE '%Vegan%' OR CuisineType LIKE '%Plant-based%')";
                    break;
                case 'non-vegetarian':
                    foodFilter = "AND CuisineType NOT LIKE '%Vegetarian%' AND CuisineType NOT LIKE '%Vegan%'";
                    break;
                default:
                    foodFilter = '';
            }

            const result = await pool.request()
                .input('cityName', sql.NVarChar, cityName)
                .query(`
                    SELECT r.* FROM Restaurants r
                    INNER JOIN Cities c ON r.city_id = c.city_id
                    WHERE c.city_name = @cityName ${foodFilter}
                `);
            return result.recordset;
        } catch (error) {
            throw new Error(`Error fetching restaurants: ${error.message}`);
        }
    }

    // Generate complete travel recommendation
    static async generateRecommendation(preferences) {
        try {
            const {
                destination,
                startDate,
                days,
                budget,
                companion,
                activities,
                foodPreference,
                additionalPreferences
            } = preferences;

            const cityDetails = await this.getCityDetails(destination);
            if (!cityDetails) {
                throw new Error('Destination not found');
            }

            const hotels = await this.getHotelsByCity(destination, budget);
            const attractions = await this.getAttractionsByActivities(destination, activities);
            const restaurants = await this.getRestaurantsByFood(destination, foodPreference);
            const itinerary = this.generateItinerary(days, attractions, restaurants, companion);

            return {
                destination: {
                    name: cityDetails.city_name,
                    description: cityDetails.description,
                    history: cityDetails.history || 'Rich historical background with cultural significance.',
                    backgroundImage: cityDetails.image_url || 'default-city-image.jpg',
                    coordinates: {
                        lat: cityDetails.latitude,
                        lng: cityDetails.longitude
                    }
                },
                hotels: hotels.slice(0, 6),
                attractions: attractions.slice(0, 10),
                restaurants: restaurants.slice(0, 8),
                itinerary: itinerary,
                preferences: {
                    budget,
                    companion,
                    activities,
                    foodPreference,
                    additionalPreferences
                }
            };
        } catch (error) {
            throw new Error(`Error generating recommendation: ${error.message}`);
        }
    }

    // Generate day-wise itinerary
    static generateItinerary(days, attractions, restaurants, companion) {
        const itinerary = [];

        for (let day = 1; day <= days; day++) {
            const dayPlan = {
                day: day,
                title: `Day ${day}`,
                activities: [],
                meals: {},
                accommodation: 'Hotel booking recommended',
                transport: this.getTransportSuggestion(companion)
            };

            const attractionsPerDay = Math.ceil(attractions.length / days);
            const startIndex = (day - 1) * attractionsPerDay;
            const dayAttractions = attractions.slice(startIndex, startIndex + attractionsPerDay);

            if (dayAttractions[0]) {
                dayPlan.activities.push({
                    time: '09:00 AM',
                    activity: `Visit ${dayAttractions[0].attraction_name || dayAttractions[0].Beach_Name || dayAttractions[0].mall_name}`,
                    description: dayAttractions[0].description || 'Explore this amazing location',
                    duration: '2-3 hours'
                });
            }

            if (dayAttractions[1]) {
                dayPlan.activities.push({
                    time: '02:00 PM',
                    activity: `Explore ${dayAttractions[1].attraction_name || dayAttractions[1].Beach_Name || dayAttractions[1].mall_name}`,
                    description: dayAttractions[1].description || 'Continue your adventure',
                    duration: '2-3 hours'
                });
            }

            if (dayAttractions[2]) {
                dayPlan.activities.push({
                    time: '06:00 PM',
                    activity: `Experience ${dayAttractions[2].attraction_name || dayAttractions[2].Beach_Name || dayAttractions[2].mall_name}`,
                    description: dayAttractions[2].description || 'End your day with this experience',
                    duration: '1-2 hours'
                });
            }

            if (restaurants.length > 0) {
                const restaurantIndex = (day - 1) % restaurants.length;
                dayPlan.meals = {
                    breakfast: 'Hotel breakfast or local café',
                    lunch: restaurants[restaurantIndex]?.RestaurantName || 'Local restaurant',
                    dinner: restaurants[(restaurantIndex + 1) % restaurants.length]?.RestaurantName || 'Local restaurant'
                };
            }

            itinerary.push(dayPlan);
        }

        return itinerary;
    }

    // Get transport suggestion based on companion type
    static getTransportSuggestion(companion) {
        switch (companion.toLowerCase()) {
            case 'solo':
                return 'Public transport, walking, or bike rental recommended';
            case 'couple':
                return 'Rental car or private taxi for romantic trips';
            case 'family':
                return 'Rental car or private van for family comfort';
            case 'friends':
                return 'Group transport or rental van for group activities';
            default:
                return 'Various transport options available';
        }
    }
}

module.exports = RecommendationModel;
