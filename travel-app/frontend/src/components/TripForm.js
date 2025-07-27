import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TripForm.css';

const TripForm = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    destination: '',
    startingDate: '',
    days: 1,
    budget: 'medium',
    companion: 'solo',
    activities: [],
    foodPreference: 'non-veg',
    furtherPreferences: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Activity options
  const activityOptions = [
    'beaches',
    'city view',
    'outdoor sites',
    'events',
    'river',
    'food street',
    'shopping malls',
    'night life'
  ];

  // Fetch destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/destinations');
        setDestinations(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, destination: response.data[0].name }));
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError('Failed to load destinations. Please try again.');
      }
    };

    fetchDestinations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'activities') {
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
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/recommend', formData);
      
      // Store the result in localStorage to pass to ResultPage
      localStorage.setItem('tripRecommendation', JSON.stringify(response.data));
      
      // Navigate to result page
      navigate('/result');
    } catch (error) {
      console.error('Error generating recommendation:', error);
      setError('Failed to generate recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-form-container">
      <header className="form-header">
        <h1>Travel Recommendation</h1>
        <p>Plan your perfect trip with our AI-powered recommendations</p>
      </header>

      <form className="trip-form" onSubmit={handleSubmit}>
        <div className="form-intro">
          <h2>Provide us your Trip preferences</h2>
          <p>Give some specific information about your trip. Our Travel Planner will generate a customized plan according to your preferences.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Destination Dropdown */}
        <div className="form-group">
          <label className="form-label">What is your Destination?</label>
          <select
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select a destination</option>
            {destinations.map((dest, index) => (
              <option key={index} value={dest.name}>
                {dest.name}, {dest.country}
              </option>
            ))}
          </select>
        </div>

        {/* Starting Date */}
        <div className="form-group">
          <label className="form-label">Select your trip date here</label>
          <input
            type="date"
            name="startingDate"
            value={formData.startingDate}
            onChange={handleInputChange}
            className="form-input"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {/* How Many Days */}
        <div className="form-group">
          <label className="form-label">How many days?</label>
          <input
            type="number"
            name="days"
            value={formData.days}
            onChange={handleInputChange}
            className="form-input"
            min="1"
            max="30"
            required
          />
        </div>

        {/* Budget Radio */}
        <div className="form-group">
          <label className="form-label">What's your budget?</label>
          <div className="radio-group">
            {['low', 'medium', 'high'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="budget"
                  value={option}
                  checked={formData.budget === option}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span className="radio-text">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Trip Companion Radio */}
        <div className="form-group">
          <label className="form-label">Who's joining you?</label>
          <div className="radio-group">
            {['solo', 'couple', 'family', 'friends'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="companion"
                  value={option}
                  checked={formData.companion === option}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span className="radio-text">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Activities Checkboxes */}
        <div className="form-group">
          <label className="form-label">What activities interest you? (Select multiple)</label>
          <div className="checkbox-group">
            {activityOptions.map(activity => (
              <label key={activity} className="checkbox-label">
                <input
                  type="checkbox"
                  name="activities"
                  value={activity}
                  checked={formData.activities.includes(activity)}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{activity.charAt(0).toUpperCase() + activity.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Food Preference Radio */}
        <div className="form-group">
          <label className="form-label">Food preference</label>
          <div className="radio-group">
            {['halal', 'veg', 'non-veg'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="foodPreference"
                  value={option}
                  checked={formData.foodPreference === option}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span className="radio-text">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Further Preferences Textarea */}
        <div className="form-group">
          <label className="form-label">Any further preferences?</label>
          <textarea
            name="furtherPreferences"
            value={formData.furtherPreferences}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Tell us about any specific requirements, interests, or preferences for your trip..."
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Generating Recommendation...' : 'Get My Trip Recommendation'}
        </button>
      </form>
    </div>
  );
};

export default TripForm;