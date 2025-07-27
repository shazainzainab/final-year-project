import React from 'react';

const WeatherSection = ({ weather }) => {
  const daily = [];
  const dayOf = (dt_txt) => new Date(dt_txt).toLocaleDateString(undefined, { weekday: 'short' });

  weather.list.forEach(item => {
    const day = dayOf(item.dt_txt);
    if (!daily.find(d => d.day === day)) {
      daily.push({ day, temp: item.main.temp, desc: item.weather[0].description });
    }
  });

  return (
    <section>
      <h2>3-Day Weather Forecast</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {daily.slice(0, 3).map(d => (
          <div key={d.day} style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
            <h4>{d.day}</h4>
            <p>{d.temp} °C</p>
            <p>{d.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeatherSection;