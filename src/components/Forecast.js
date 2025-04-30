import React from 'react';
import WeatherIcon from './WeatherIcon';

const Forecast = ({ data, unit, highContrast }) => {
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  
  // Group forecast by day
  const dailyForecast = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Get one forecast per day (around midday)
  const forecastDays = Object.keys(dailyForecast).map(date => {
    return dailyForecast[date][Math.floor(dailyForecast[date].length / 2)];
  });

  return (
    <section aria-labelledby="forecast-heading" className={`forecast ${highContrast ? 'high-contrast' : ''}`}>
      <h2 id="forecast-heading">5-Day Forecast</h2>
      <div className="forecast-days">
        {forecastDays.slice(0, 5).map((day, index) => (
          <div key={index} className="forecast-day">
            <p>{new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short' })}</p>
            <WeatherIcon code={day.weather[0].icon} alt={day.weather[0].description} />
            <p>
              {Math.round(day.main.temp_max)}{tempUnit} / {Math.round(day.main.temp_min)}{tempUnit}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Forecast;