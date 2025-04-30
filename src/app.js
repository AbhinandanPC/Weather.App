import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import LocationSearch from './components/LocationSearch';
import AccessibilityControls from './components/AccessibilityControls';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('metric');
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    fontSize: 'medium'
  });

  // Get user's location if permitted
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
          fetchForecast(latitude, longitude);
        },
        (error) => {
          console.log('Geolocation permission denied, using default location');
          fetchWeather(51.5074, -0.1278); // Default to London
          fetchForecast(51.5074, -0.1278);
        }
      );
    }
  }, [unit]);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const fetchForecast = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      setForecastData(response.data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    // In a real app, you would geocode the location to get lat/lon
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className={`App ${accessibility.highContrast ? 'high-contrast' : ''} ${accessibility.fontSize}`}>
      <header>
        <h1>Responsible Weather</h1>
        <AccessibilityControls 
          accessibility={accessibility} 
          setAccessibility={setAccessibility}
        />
      </header>
      
      <main>
        <LocationSearch 
          onLocationChange={handleLocationChange} 
          currentLocation={location}
        />
        
        <button onClick={toggleUnit} className="unit-toggle">
          Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </button>
        
        {weatherData && (
          <CurrentWeather 
            data={weatherData} 
            unit={unit} 
            highContrast={accessibility.highContrast}
          />
        )}
        
        {forecastData && (
          <Forecast 
            data={forecastData} 
            unit={unit} 
            highContrast={accessibility.highContrast}
          />
        )}
      </main>
      
      <footer>
        <p>Data provided by OpenWeatherMap</p>
        <p>This app collects minimal data and respects your privacy.</p>
      </footer>
    </div>
  );
}

export default App;