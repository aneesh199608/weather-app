// This module handles all interactions with the DOM.
// import { loadIcon } from './icons.js'; // Uncomment if using dynamic icons

// --- DOM Element Selectors ---
// It's good practice to query elements once and store them if they are used frequently.
const locationInput = document.getElementById('location-input');
const searchButton = document.getElementById('search-button');
const weatherDisplay = document.getElementById('weather-display');
const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const conditions = document.getElementById('conditions');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon'); // Assumes <img id="weather-icon">
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading-indicator'); // Assumes <div id="loading-indicator">Loading...</div>

// --- DOM Manipulation Functions ---

/**
 * Updates the weather display section with new data.
 * @param {object} weatherData - Processed weather data object.
 *                               Expected structure: { temp, conditions, icon, humidity, windspeed, location, datetime }
 */
export function updateWeatherDisplay(weatherData) {
  if (!weatherDisplay) return; // Guard clause if element doesn't exist

  // Clear previous error messages
  clearError();

  // Update text content
  if (locationName) locationName.textContent = weatherData.location || 'Unknown Location';
  if (temperature) temperature.textContent = `${weatherData.temp?.toFixed(1)}°C` || 'N/A'; // Use optional chaining and nullish coalescing
  if (conditions) conditions.textContent = weatherData.conditions || 'N/A';
  if (humidity) humidity.textContent = `Humidity: ${weatherData.humidity?.toFixed(0)}%` || 'N/A';
  if (windSpeed) windSpeed.textContent = `Wind: ${weatherData.windspeed?.toFixed(1)} km/h` || 'N/A';

  // Update Icon (Example - uncomment and adapt if using dynamic icons)
  /*
  if (weatherIcon && weatherData.icon) {
    weatherIcon.style.display = 'block'; // Make sure it's visible
    loadIcon(weatherData.icon)
      .then(iconPath => {
        if (iconPath) {
          weatherIcon.src = iconPath;
          weatherIcon.alt = weatherData.conditions || 'Weather icon';
        } else {
          weatherIcon.style.display = 'none'; // Hide if icon loading failed
        }
      })
      .catch(() => {
        weatherIcon.style.display = 'none'; // Hide on error
      });
  } else if (weatherIcon) {
    weatherIcon.style.display = 'none'; // Hide if no icon code
  }
  */
 // Simple fallback if not using dynamic icons:
  if (weatherIcon) weatherIcon.style.display = 'none'; // Hide icon element for now


  // Make the weather display visible if it was hidden
  weatherDisplay.style.display = 'block'; // Or 'flex', 'grid', etc., depending on your layout
}

/**
 * Shows a loading indicator and disables the search button.
 */
export function showLoadingState() {
  if (loadingIndicator) loadingIndicator.style.display = 'block';
  if (searchButton) searchButton.disabled = true;
  if (weatherDisplay) weatherDisplay.style.display = 'none'; // Hide previous results
  clearError(); // Clear errors when starting a new search
}

/**
 * Hides the loading indicator and enables the search button.
 */
export function hideLoadingState() {
  if (loadingIndicator) loadingIndicator.style.display = 'none';
  if (searchButton) searchButton.disabled = false;
}

/**
 * Displays an error message to the user.
 * @param {string} message - The error message to display.
 */
export function displayError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
  if (weatherDisplay) weatherDisplay.style.display = 'none'; // Hide weather display on error
}

/**
 * Clears any currently displayed error message.
 */
export function clearError() {
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }
}

/**
 * Gets the location value from the input field.
 * @returns {string} The trimmed value from the location input field.
 */
export function getInputLocation() {
  return locationInput ? locationInput.value.trim() : '';
}

/**
 * Adds an event listener to the search button (or form).
 * @param {Function} handler - The function to call when the search is triggered.
 */
export function addSearchListener(handler) {
    // Prefer listening to form submission if input is inside a form
    const form = locationInput?.closest('form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent page reload
            handler(); // Call the handler passed from index.js
        });
    } else if (searchButton) {
        // Fallback to button click if not in a form
        searchButton.addEventListener('click', handler);
    } else {
        console.warn('Could not find search form or button to attach listener.');
    }
}
