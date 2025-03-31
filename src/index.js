import './styles.css'; // Import CSS - Webpack will handle this
import { fetchWeatherData } from './api.js';
import {
  updateWeatherDisplay,
  showLoadingState,
  hideLoadingState,
  displayError,
  clearError,
  getInputLocation,
  addSearchListener
} from './dom.js';

/**
 * Parses the raw API data into a simpler format for the DOM.
 * Adjust this based on the actual structure of the Visual Crossing API response
 * and the data points you want to display.
 * @param {object} data - Raw data from the Visual Crossing API.
 * @returns {object} Simplified weather data object.
 */
function parseWeatherData(data) {
  if (!data || !data.currentConditions || !data.resolvedAddress) {
    console.error('Invalid or incomplete weather data received:', data);
    throw new Error('Invalid weather data received from API.');
  }
  const current = data.currentConditions;
  return {
    temp: current.temp,
    conditions: current.conditions,
    icon: current.icon, // e.g., 'partly-cloudy-day' - used if implementing icons.js
    humidity: current.humidity,
    windspeed: current.windspeed,
    location: data.resolvedAddress,
    datetime: current.datetimeEpoch * 1000 // Convert seconds to milliseconds
    // Add more fields as needed from 'data.days', etc.
  };
}


/**
 * Handles the search process when triggered by the user.
 */
async function handleSearch() {
  clearError(); // Clear previous errors
  const location = getInputLocation();

  if (!location) {
    displayError('Please enter a location.');
    return; // Stop if input is empty
  }

  showLoadingState();

  try {
    const rawData = await fetchWeatherData(location);
    const weatherData = parseWeatherData(rawData); // Parse the data
    updateWeatherDisplay(weatherData); // Update the DOM
  } catch (error) {
    console.error('Error during weather search:', error);
    // Display a user-friendly error message
    displayError(`Failed to get weather: ${error.message}`);
  } finally {
    // This block executes whether the try succeeded or failed
    hideLoadingState();
  }
}

/**
 * Initializes the application by setting up event listeners.
 */
function init() {
  console.log('Weather App Initializing...');
  addSearchListener(handleSearch); // Add the manual search listener
  console.log('Manual search listener added.');

  // Attempt to get weather for current location on load
  getWeatherForCurrentLocation();
}

/**
 * Attempts to get the user's current location and fetch weather data for it.
 */
async function getWeatherForCurrentLocation() {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by this browser.');
    // Optionally display a message to the user via dom.js
    // displayError("Geolocation is not supported by your browser.");
    return; // Exit if geolocation is not available
  }

  console.log('Attempting to get current location...');
  showLoadingState(); // Show loading indicator while getting location/weather

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const locationString = `${lat},${lon}`; // Format for Visual Crossing API
      console.log(`Location found: ${locationString}`);

      try {
        const rawData = await fetchWeatherData(locationString);
        const weatherData = parseWeatherData(rawData);
        // Modify the location name to be more user-friendly if desired
        // weatherData.location = `Your Current Location (${weatherData.location})`;
        updateWeatherDisplay(weatherData);
      } catch (error) {
        console.error('Error fetching weather for current location:', error);
        displayError(`Failed to get weather for your location: ${error.message}`);
      } finally {
        hideLoadingState();
      }
    },
    (error) => {
      // Handle errors (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT)
      console.error(`Geolocation Error (${error.code}): ${error.message}`);
      let userMessage = 'Could not get your current location.';
      if (error.code === error.PERMISSION_DENIED) {
        userMessage = 'Location permission denied. Please enter a location manually.';
      }
      displayError(userMessage);
      hideLoadingState(); // Hide loading indicator on error
    }
  );
}


// --- Application Start ---
// Run the initialization function when the script loads
init();
