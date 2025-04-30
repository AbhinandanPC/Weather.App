import React, { useState, useEffect, useCallback } from 'react';

// --- Mock Weather Data ---
// In a real app, you'd fetch this from a weather API (e.g., OpenWeatherMap, WeatherAPI)
const mockWeatherData = {
  'Azamgarh': {
    current: {
      temp_c: 35,
      condition: { text: 'Sunny', icon: 'sun' },
      humidity: 40,
      wind_kph: 15,
    },
    forecast: [
      { date: '2025-05-01', day: { maxtemp_c: 36, mintemp_c: 24, condition: { text: 'Partly cloudy', icon: 'cloud-sun' } } },
      { date: '2025-05-02', day: { maxtemp_c: 37, mintemp_c: 25, condition: { text: 'Sunny', icon: 'sun' } } },
      { date: '2025-05-03', day: { maxtemp_c: 34, mintemp_c: 23, condition: { text: 'Patchy rain possible', icon: 'cloud-drizzle' } } },
    ],
  },
  'London': {
    current: {
      temp_c: 15,
      condition: { text: 'Cloudy', icon: 'cloud' },
      humidity: 75,
      wind_kph: 20,
    },
    forecast: [
      { date: '2025-05-01', day: { maxtemp_c: 16, mintemp_c: 9, condition: { text: 'Light rain shower', icon: 'cloud-drizzle' } } },
      { date: '2025-05-02', day: { maxtemp_c: 17, mintemp_c: 10, condition: { text: 'Partly cloudy', icon: 'cloud-sun' } } },
      { date: '2025-05-03', day: { maxtemp_c: 18, mintemp_c: 11, condition: { text: 'Sunny', icon: 'sun' } } },
    ],
  },
  'New York': {
     current: {
      temp_c: 22,
      condition: { text: 'Partly cloudy', icon: 'cloud-sun' },
      humidity: 60,
      wind_kph: 10,
    },
    forecast: [
      { date: '2025-05-01', day: { maxtemp_c: 24, mintemp_c: 15, condition: { text: 'Sunny', icon: 'sun' } } },
      { date: '2025-05-02', day: { maxtemp_c: 23, mintemp_c: 16, condition: { text: 'Patchy rain possible', icon: 'cloud-drizzle' } } },
      { date: '2025-05-03', day: { maxtemp_c: 25, mintemp_c: 17, condition: { text: 'Sunny', icon: 'sun' } } },
    ],
  },
   'Tokyo': {
     current: {
      temp_c: 18,
      condition: { text: 'Rain', icon: 'cloud-rain' },
      humidity: 85,
      wind_kph: 12,
    },
    forecast: [
      { date: '2025-05-01', day: { maxtemp_c: 19, mintemp_c: 14, condition: { text: 'Light rain', icon: 'cloud-drizzle' } } },
      { date: '2025-05-02', day: { maxtemp_c: 20, mintemp_c: 15, condition: { text: 'Cloudy', icon: 'cloud' } } },
      { date: '2025-05-03', day: { maxtemp_c: 21, mintemp_c: 16, condition: { text: 'Partly cloudy', icon: 'cloud-sun' } } },
    ],
  }
};

// --- Helper Function to get Day Name ---
const getDayName = (dateString) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(dateString);
  // Adjust for timezone offset to prevent date shifting
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
  return days[adjustedDate.getDay()];
};


// --- Weather Icon Component ---
// Using inline SVGs as placeholders for lucide-react icons
const WeatherIcon = ({ iconName, className }) => {
  const iconMap = {
    sun: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
    cloud: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
    'cloud-sun': (
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="M20 12h2" />
        <path d="m19.07 4.93-1.41 1.41" />
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
       </svg>
    ),
    'cloud-drizzle': (
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M8 19v1" />
        <path d="M8 14v1" />
        <path d="M16 19v1" />
        <path d="M16 14v1" />
        <path d="M12 21v1" />
        <path d="M12 16v1" />
       </svg>
    ),
    'cloud-rain': (
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M16 14v6" />
        <path d="M8 14v6" />
        <path d="M12 16v6" />
       </svg>
    ),
    // Add more icons as needed
  };
  return iconMap[iconName] || iconMap['cloud']; // Default to cloud if icon not found
};


// --- Main App Component ---
function App() {
  // State variables
  const [location, setLocation] = useState('Azamgarh'); // Default location
  const [searchTerm, setSearchTerm] = useState('Azamgarh');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch weather data (simulated)
  const fetchWeatherData = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    setWeatherData(null); // Clear previous data

    // --- Simulate API Call ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // In a real app, replace this with an actual API call:
    // try {
    //   const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    //   const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${loc}&days=3&aqi=no&alerts=no`;
    //   const response = await fetch(apiUrl);
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //   const data = await response.json();
    //   if (data.error) {
    //      throw new Error(data.error.message);
    //   }
    //   setWeatherData(data);
    // } catch (err) {
    //   setError(err.message || 'Failed to fetch weather data.');
    //   setWeatherData(null); // Ensure data is null on error
    // } finally {
    //   setLoading(false);
    // }

    // --- Mock Data Logic ---
    const normalizedLoc = loc.trim().charAt(0).toUpperCase() + loc.trim().slice(1).toLowerCase();
    const data = mockWeatherData[normalizedLoc];

    if (data) {
      setWeatherData(data);
      setError(null);
    } else {
      setError(`Weather data not found for "${loc}". Try London, New York, Tokyo, or Azamgarh.`);
      setWeatherData(null);
    }
    setLoading(false);
    // --- End Mock Data Logic ---

  }, []); // No dependencies, fetch function itself doesn't change

  // Effect to fetch data on initial load and when location changes
  useEffect(() => {
    if (location) {
      fetchWeatherData(location);
    }
  }, [location, fetchWeatherData]); // Depend on location and the fetch function

  // Handle search input change
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle form submission
  const handleSearch = (event) => {
    event.preventDefault(); // Prevent page reload
    if (searchTerm.trim()) {
      setLocation(searchTerm.trim());
    }
  };

  return (
    // Main container with Tailwind CSS classes for styling and responsiveness
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4 sm:p-6 lg:p-8 flex flex-col items-center font-sans">
      {/* App Card */}
      {/* Use `Card` component from shadcn/ui in a real setup */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full max-w-md lg:max-w-lg xl:max-w-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Weather Forecast</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          {/* Use `Input` component from shadcn/ui in a real setup */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Enter city name..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            aria-label="Enter city name"
          />
          {/* Use `Button` component from shadcn/ui in a real setup */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label="Search weather"
          >
            Search
          </button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-600 mt-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Loading weather data...
          </div>
        )}

        {/* Error State */}
        {error && (
          // Use `Alert` or `AlertDescription` from shadcn/ui in a real setup
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-4 text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Weather Data Display */}
        {weatherData && !loading && !error && (
          <div className="space-y-6">
            {/* Current Weather Section */}
            {/* Use `Card` component from shadcn/ui in a real setup */}
            <div className="bg-blue-100/50 rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Current Weather in {location.charAt(0).toUpperCase() + location.slice(1)}</h2>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Use lucide-react icon component here */}
                  <WeatherIcon iconName={weatherData.current.condition.icon} className="w-16 h-16 text-yellow-500" />
                  <div>
                    <p className="text-4xl font-bold text-gray-800">{weatherData.current.temp_c}°C</p>
                    <p className="text-gray-600">{weatherData.current.condition.text}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 text-center sm:text-right">
                  <p>Humidity: {weatherData.current.humidity}%</p>
                  <p>Wind: {weatherData.current.wind_kph} kph</p>
                </div>
              </div>
            </div>

            {/* Forecast Section */}
             {/* Use `Card` component from shadcn/ui in a real setup */}
            <div className="bg-blue-100/50 rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">3-Day Forecast</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {weatherData.forecast.map((day) => (
                  <div key={day.date} className="bg-white/70 rounded-lg p-3 text-center shadow-sm">
                    <p className="font-semibold text-gray-700">{getDayName(day.date)}</p>
                    {/* Use lucide-react icon component here */}
                    <WeatherIcon iconName={day.day.condition.icon} className="w-10 h-10 mx-auto my-2 text-blue-500" />
                    <p className="text-lg font-medium text-gray-800">{day.day.maxtemp_c}°C</p>
                    <p className="text-sm text-gray-500">{day.day.mintemp_c}°C</p>
                    <p className="text-xs text-gray-600 mt-1 truncate" title={day.day.condition.text}>{day.day.condition.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
       {/* Footer/Attribution (Optional) */}
      <footer className="mt-8 text-center text-white/70 text-sm">
        Weather data is simulated. In a real app, use a proper weather API.
      </footer>
    </div>
  );
}

export default App; // Export the main component
