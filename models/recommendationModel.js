const { getPool, sql } = require('../config/database');

class RecommendationModel {
    // Get all available destinations
    static async getDestinations() {
        try {
            const pool = getPool();
            const result = await pool.request()
                .query('SELECT DISTINCT CityName, Description FROM Cities ORDER BY CityName');
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
                    WHERE CityName = @cityName
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
            
            // Map budget to price ranges
            switch (budget.toLowerCase()) {
                case 'low':
                    budgetFilter = 'AND PricePerNight <= 100';
                    break;
                case 'medium':
                    budgetFilter = 'AND PricePerNight BETWEEN 100 AND 300';
                    break;
                case 'high':
                    budgetFilter = 'AND PricePerNight >= 300';
                    break;
                default:
                    budgetFilter = '';
            }

            const result = await pool.request()
                .input('cityName', sql.NVarChar, cityName)
                .query(`
                    SELECT h.* FROM Hotels h
                    INNER JOIN Cities c ON h.CityID = c.CityID
                    WHERE c.CityName = @cityName ${budgetFilter}
                    ORDER BY h.Rating DESC
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

            // Get city ID first
            const cityResult = await pool.request()
                .input('cityName', sql.NVarChar, cityName)
                .query('SELECT CityID FROM Cities WHERE CityName = @cityName');
            
            if (cityResult.recordset.length === 0) {
                throw new Error('City not found');
            }

            const cityId = cityResult.recordset[0].CityID;

            // Fetch different types of attractions based on activities
            if (activities.includes('Beaches')) {
                const beachesResult = await pool.request()
                    .input('cityId', sql.Int, cityId)
                    .query('SELECT *, \'Beach\' as Type FROM Beaches WHERE CityID = @cityId');
                attractions = attractions.concat(beachesResult.recordset);
            }

            if (activities.includes('Shopping mall')) {
                const mallsResult = await pool.request()
                    .input('cityId', sql.Int, cityId)
                    .query('SELECT *, \'Shopping Mall\' as Type FROM ShoppingMalls WHERE CityID = @cityId');
                attractions = attractions.concat(mallsResult.recordset);
            }

            // Get general attraction places for other activities
            const generalResult = await pool.request()
                .input('cityId', sql.Int, cityId)
                .query('SELECT *, \'Attraction\' as Type FROM AttractionPlaces WHERE CityID = @cityId');
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

            // Map food preferences to cuisine types
            switch (foodPreference.toLowerCase()) {
                case 'halal':
                    foodFilter = 'AND (CuisineType LIKE \'%Halal%\' OR CuisineType LIKE \'%Middle Eastern%\' OR CuisineType LIKE \'%Turkish%\')';
                    break;
                case 'vegetarian':
                    foodFilter = 'AND (CuisineType LIKE \'%Vegetarian%\' OR CuisineType LIKE \'%Vegan%\' OR CuisineType LIKE \'%Plant-based%\')';
                    break;
                case 'non-vegetarian':
                    foodFilter = 'AND CuisineType NOT LIKE \'%Vegetarian%\' AND CuisineType NOT LIKE \'%Vegan%\'';
                    break;
                default:
                    foodFilter = '';
            }

            const result = await pool.request()
                .input('cityName', sql.NVarChar, cityName)
                .query(`
                    SELECT r.* FROM Restaurants r
                    INNER JOIN Cities c ON r.CityID = c.CityID
                    WHERE c.CityName = @cityName ${foodFilter}
                    ORDER BY r.Rating DESC
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

            // Get city details
            const cityDetails = await this.getCityDetails(destination);
            if (!cityDetails) {
                throw new Error('Destination not found');
            }

            // Get hotels
            const hotels = await this.getHotelsByCity(destination, budget);

            // Get attractions based on activities
            const attractions = await this.getAttractionsByActivities(destination, activities);

            // Get restaurants
            const restaurants = await this.getRestaurantsByFood(destination, foodPreference);

            // Generate day-wise itinerary
            const itinerary = this.generateItinerary(days, attractions, restaurants, companion);

            return {
                destination: {
                    name: cityDetails.CityName,
                    description: cityDetails.Description,
                    history: cityDetails.History || 'Rich historical background with cultural significance.',
                    backgroundImage: cityDetails.ImageURL || 'default-city-image.jpg',
                    coordinates: {
                        lat: cityDetails.Latitude,
                        lng: cityDetails.Longitude
                    }
                },
                hotels: hotels.slice(0, 6), // Limit to top 6 hotels
                attractions: attractions.slice(0, 10), // Limit to top 10 attractions
                restaurants: restaurants.slice(0, 8), // Limit to top 8 restaurants
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

            // Distribute attractions across days
            const attractionsPerDay = Math.ceil(attractions.length / days);
            const startIndex = (day - 1) * attractionsPerDay;
            const dayAttractions = attractions.slice(startIndex, startIndex + attractionsPerDay);

            // Morning activity
            if (dayAttractions[0]) {
                dayPlan.activities.push({
                    time: '09:00 AM',
                    activity: `Visit ${dayAttractions[0].PlaceName || dayAttractions[0].BeachName || dayAttractions[0].MallName}`,
                    description: dayAttractions[0].Description || 'Explore this amazing location',
                    duration: '2-3 hours'
                });
            }

            // Afternoon activity
            if (dayAttractions[1]) {
                dayPlan.activities.push({
                    time: '02:00 PM',
                    activity: `Explore ${dayAttractions[1].PlaceName || dayAttractions[1].BeachName || dayAttractions[1].MallName}`,
                    description: dayAttractions[1].Description || 'Continue your adventure',
                    duration: '2-3 hours'
                });
            }

            // Evening activity
            if (dayAttractions[2]) {
                dayPlan.activities.push({
                    time: '06:00 PM',
                    activity: `Experience ${dayAttractions[2].PlaceName || dayAttractions[2].BeachName || dayAttractions[2].MallName}`,
                    description: dayAttractions[2].Description || 'End your day with this experience',
                    duration: '1-2 hours'
                });
            }

            // Meals
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