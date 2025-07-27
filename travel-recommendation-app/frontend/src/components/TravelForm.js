import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TravelForm.css';

const TravelForm = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    numberOfDays: 1,
    budget: 'medium',
    companion: 'solo',
    activities: [],
    foodPreference: 'non-veg',
    furtherPreferences: ''
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/destinations');
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        activities: checked 
          ? [...prev.activities, value]
          : prev.activities.filter(activity => activity !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/recommend', formData);
      
      // Store the result in localStorage for the result page
      localStorage.setItem('tripRecommendation', JSON.stringify(response.data));
      
      // Navigate to result page
      navigate('/result');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error generating recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activityOptions = [
    'beaches', 'city view', 'outdoor sites', 'events', 
    'river', 'food street', 'shopping malls', 'night life'
  ];

  return (
    <div className="travel-form-container">
      <div className="form-card">
        <h2>Plan Your Perfect Trip</h2>
        <p className="form-subtitle">Tell us about your travel preferences and we'll create a personalized recommendation!</p>
        
        <form onSubmit={handleSubmit} className="travel-form">
          {/* Destination */}
          <div className="form-group">
            <label htmlFor="destination">Destination *</label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a destination</option>
              {destinations.map(dest => (
                <option key={dest._id} value={dest.name}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="startDate">Starting Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Number of Days */}
          <div className="form-group">
            <label htmlFor="numberOfDays">How Many Days *</label>
            <input
              type="number"
              id="numberOfDays"
              name="numberOfDays"
              min="1"
              max="30"
              value={formData.numberOfDays}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Budget */}
          <div className="form-group">
            <label>Budget *</label>
            <div className="radio-group">
              {['low', 'medium', 'high'].map(budget => (
                <label key={budget} className="radio-label">
                  <input
                    type="radio"
                    name="budget"
                    value={budget}
                    checked={formData.budget === budget}
                    onChange={handleInputChange}
                  />
                  <span className="radio-text">{budget.charAt(0).toUpperCase() + budget.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Trip Companion */}
          <div className="form-group">
            <label>Trip Companion *</label>
            <div className="radio-group">
              {['solo', 'couple', 'family', 'friends'].map(companion => (
                <label key={companion} className="radio-label">
                  <input
                    type="radio"
                    name="companion"
                    value={companion}
                    checked={formData.companion === companion}
                    onChange={handleInputChange}
                  />
                  <span className="radio-text">{companion.charAt(0).toUpperCase() + companion.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="form-group">
            <label>Activities (Select all that apply)</label>
            <div className="checkbox-group">
              {activityOptions.map(activity => (
                <label key={activity} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="activities"
                    value={activity}
                    checked={formData.activities.includes(activity)}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-text">{activity.charAt(0).toUpperCase() + activity.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Food Preference */}
          <div className="form-group">
            <label>Food Preference *</label>
            <div className="radio-group">
              {['halal', 'veg', 'non-veg'].map(food => (
                <label key={food} className="radio-label">
                  <input
                    type="radio"
                    name="foodPreference"
                    value={food}
                    checked={formData.foodPreference === food}
                    onChange={handleInputChange}
                  />
                  <span className="radio-text">{food.charAt(0).toUpperCase() + food.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Further Preferences */}
          <div className="form-group">
            <label htmlFor="furtherPreferences">Further Preferences</label>
            <textarea
              id="furtherPreferences"
              name="furtherPreferences"
              value={formData.furtherPreferences}
              onChange={handleInputChange}
              placeholder="Any additional preferences or special requirements..."
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Generating Recommendation...' : 'Get My Travel Recommendation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelForm;