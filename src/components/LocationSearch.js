import React, { useState } from 'react';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import axios from 'axios';
import '@reach/combobox/styles.css';

const LocationSearch = ({ onLocationChange, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelect = (selected) => {
    setQuery(selected);
    onLocationChange(selected);
    // In a real app, you would geocode the selected location
  };

  const fetchSuggestions = async () => {
    if (query.length < 3) return;
    
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      setSuggestions(response.data.map(loc => `${loc.name}, ${loc.country}`));
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  return (
    <div className="location-search">
      <Combobox onSelect={handleSelect} aria-label="Search for a location">
        <ComboboxInput
          value={query}
          onChange={handleChange}
          onBlur={fetchSuggestions}
          placeholder="Enter a city name"
        />
        {suggestions.length > 0 && (
          <ComboboxPopover>
            <ComboboxList>
              {suggestions.map((suggestion, index) => (
                <ComboboxOption key={index} value={suggestion} />
              ))}
            </ComboboxList>
          </ComboboxPopover>
        )}
      </Combobox>
    </div>
  );
};

export default LocationSearch;