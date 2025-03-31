// This module handles interactions with the Visual Crossing Weather API.

// Replace with your actual Visual Crossing API key
const API_KEY = 'DV49559WJTSR84BDNZ2SQJPRD';
const BASE_URL =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

/**
 * Fetches weather data for a given location from the Visual Crossing API.
 * @param {string} location - The city name or coordinates.
 * @returns {Promise<object>} A promise that resolves with the raw weather data JSON.
 */
export async function fetchWeatherData(location) {
  // Construct the API URL
  // encodeURIComponent ensures that special characters in the location are handled correctly.
  const apiUrl = `${BASE_URL}${encodeURIComponent(location)}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  console.log(`Fetching weather data for: ${location}`); // Log the location being fetched

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404 Not Found, 401 Unauthorized)
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText })); // Try to parse error JSON, fallback to status text
      console.error('API Error Response:', errorData);
      throw new Error(
        `API Error: ${response.status} ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    console.log('API Data Received:', data); // Log the received data
    return data;
  } catch (error) {
    // Handle network errors (e.g., no internet connection) or other issues during fetch
    console.error('Fetch Weather Data Failed:', error);
    // Re-throw the error so it can be caught by the caller (in index.js)
    throw new Error(`Failed to fetch weather data. ${error.message}`);
  }
}

/**
 * Uses OpenStreetMap Nominatim API to get a named location from coordinates.
 * Note: Respect Nominatim's usage policy (max 1 request/sec, provide User-Agent).
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @returns {Promise<string>} A promise that resolves with the display name (e.g., "City, Country").
 */
export async function getNamedLocation(lat, lon) {
  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`; // zoom=10 typically gives city level

  console.log(`Fetching named location for: ${lat}, ${lon}`);

  try {
    const response = await fetch(nominatimUrl, {
      method: 'GET',
      headers: {
        // It's good practice to identify your application, though not strictly enforced for basic use
        // 'User-Agent': 'YourWeatherAppName/1.0 (your-contact-email@example.com)'
      },
    });

    if (!response.ok) {
      throw new Error(
        `Nominatim API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('Nominatim Data Received:', data);

    // Construct a display name (adjust based on Nominatim response structure and desired format)
    let displayName = 'Unknown Location';
    if (data && data.display_name) {
      displayName = data.display_name;
      // Or build it from address components if needed:
      // const address = data.address;
      // displayName = [address.city, address.state, address.country].filter(Boolean).join(', ');
    }

    return displayName;
  } catch (error) {
    console.error('Failed to get named location:', error);
    // Return a fallback or re-throw
    return `Location near ${lat.toFixed(2)}, ${lon.toFixed(2)}`; // Fallback
  }
}

// Example of a function to parse/simplify the data if needed
// You might expand this based on what specific data points you need.
/*
export function parseWeatherData(data) {
  if (!data || !data.currentConditions) {
    throw new Error('Invalid weather data received from API.');
  }
  const current = data.currentConditions;
  return {
    temp: current.temp,
    conditions: current.conditions,
    icon: current.icon, // e.g., 'partly-cloudy-day'
    humidity: current.humidity,
    windspeed: current.windspeed,
    location: data.resolvedAddress,
    datetime: current.datetimeEpoch * 1000 // Convert seconds to milliseconds
    // Add more fields as needed from 'data.days', etc.
  };
}
*/
