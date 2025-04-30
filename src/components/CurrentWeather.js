import React from 'react';
import WeatherIcon from './WeatherIcon';

const CurrentWeather = ({ data, unit, highContrast }) => {
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <section aria-labelledby="current-weather-heading" className={`current-weather ${highContrast ? 'high-contrast' : ''}`}>
      <h2 id="current-weather-heading">Current Weather</h2>
      <div className="weather-display">
        <WeatherIcon code={data.weather[0].icon} alt={data.weather[0].description} />
        <div className="weather-details">
          <p className="temperature">
            {Math.round(data.main.temp)}{tempUnit}
          </p>
          <p className="conditions">{data.weather[0].description}</p>
          <p>Humidity: {data.main.humidity}%</p>
          <p>Wind: {data.wind.speed} {windUnit}</p>
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;