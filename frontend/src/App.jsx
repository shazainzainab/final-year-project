import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({
    destinationId: '',
    startDate: '',
    days: 1,
    budget: 'medium',
    companion: 'solo',
    activities: [],
    foodPreference: 'non-veg',
    furtherPreferences: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/destinations')
      .then(res => {
        setDestinations(res.data);
        if (res.data.length) {
          setForm(f => ({ ...f, destinationId: res.data[0]._id }));
        }
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => {
        const acts = checked ? [...prev.activities, value] : prev.activities.filter(a => a !== value);
        return { ...prev, activities: acts };
      });
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/recommend', form)
      .then(res => navigate('/result', { state: res.data }));
  };

  const activityOptions = ['beaches', 'city view', 'outdoor sites', 'events', 'river', 'food street', 'shopping malls', 'night life'];

  return (
    <div className="container">
      <h1>Plan Your Trip</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Destination:</label>
          <select name="destinationId" value={form.destinationId} onChange={handleChange}>
            {destinations.map(d => (
              <option key={d._id} value={d._id}>{d.name}, {d.country}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Starting Date:</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
        </div>
        <div>
          <label>How Many Days:</label>
          <input type="number" name="days" min="1" value={form.days} onChange={handleChange} />
        </div>
        <fieldset>
          <legend>Budget</legend>
          {['low', 'medium', 'high'].map(b => (
            <label key={b}><input type="radio" name="budget" value={b} checked={form.budget === b} onChange={handleChange} /> {b}</label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Trip Companion</legend>
          {['solo', 'couple', 'family', 'friends'].map(c => (
            <label key={c}><input type="radio" name="companion" value={c} checked={form.companion === c} onChange={handleChange} /> {c}</label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Activities</legend>
          {activityOptions.map(a => (
            <label key={a}><input type="checkbox" name="activities" value={a} checked={form.activities.includes(a)} onChange={handleChange} /> {a}</label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Food Preference</legend>
          {['halal', 'veg', 'non-veg'].map(f => (
            <label key={f}><input type="radio" name="foodPreference" value={f} checked={form.foodPreference === f} onChange={handleChange} /> {f}</label>
          ))}
        </fieldset>
        <div>
          <label>Further Preferences:</label>
          <textarea name="furtherPreferences" value={form.furtherPreferences} onChange={handleChange}></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;