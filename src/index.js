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
  addSearchListener(handleSearch); // Add the event listener via the DOM module
  console.log('Event listener added.');
}

// --- Application Start ---
// Run the initialization function when the script loads
init();
