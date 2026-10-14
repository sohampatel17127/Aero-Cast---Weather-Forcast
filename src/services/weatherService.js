/**
 * SapphireIQ Weather Application — OpenWeatherMap REST API Service
 * 
 * Module 3 Integration:
 * - Asynchronous HTTP GET requests via fetch() and async/await
 * - OpenWeatherMap REST API endpoints (/weather, /forecast, /air_pollution)
 * - Environment variable API key integration (VITE_WEATHER_API_KEY)
 * - Sanitized data transformation with captured windSpeed, country, and air quality
 */

/**
 * Reads API configuration from Vite environment variables (.env)
 */
export const getWeatherApiConfig = () => {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});
  const apiKey = (env.VITE_WEATHER_API_KEY || env.VITE_WEATHERAPI_KEY || env.VITE_OPENWEATHER_API_KEY || '68c690ab09a769f3b2bd376b808ceb0b').trim();
  const defaultCity = env.VITE_DEFAULT_CITY || 'New Delhi';

  return {
    apiKey,
    hasKey: Boolean(apiKey && !apiKey.includes('your_')),
    defaultCity,
  };
};

/**
 * Calculates standard US EPA / CPCB Air Quality Index from PM2.5 and PM10 (µg/m³)
 * Follows official linear breakpoint interpolation.
 */
export const calculateOfficialAqi = (pm25, pm10) => {
  let aqiPm25 = 0;
  let aqiPm10 = 0;

  if (pm25 != null && !isNaN(pm25)) {
    const cp = Number(pm25);
    if (cp <= 12.0) aqiPm25 = Math.round((50 / 12.0) * cp);
    else if (cp <= 35.4) aqiPm25 = Math.round(((100 - 51) / (35.4 - 12.1)) * (cp - 12.1) + 51);
    else if (cp <= 55.4) aqiPm25 = Math.round(((150 - 101) / (55.4 - 35.5)) * (cp - 35.5) + 101);
    else if (cp <= 150.4) aqiPm25 = Math.round(((200 - 151) / (150.4 - 55.5)) * (cp - 55.5) + 151);
    else if (cp <= 250.4) aqiPm25 = Math.round(((300 - 201) / (250.4 - 150.5)) * (cp - 150.5) + 201);
    else if (cp <= 350.4) aqiPm25 = Math.round(((400 - 301) / (350.4 - 250.5)) * (cp - 250.5) + 301);
    else if (cp <= 500.4) aqiPm25 = Math.round(((500 - 401) / (500.4 - 350.5)) * (cp - 350.5) + 401);
    else aqiPm25 = 500;
  }

  if (pm10 != null && !isNaN(pm10)) {
    const cp = Number(pm10);
    if (cp <= 54) aqiPm10 = Math.round((50 / 54) * cp);
    else if (cp <= 154) aqiPm10 = Math.round(((100 - 51) / (154 - 55)) * (cp - 55) + 51);
    else if (cp <= 254) aqiPm10 = Math.round(((150 - 101) / (254 - 155)) * (cp - 155) + 101);
    else if (cp <= 354) aqiPm10 = Math.round(((200 - 151) / (354 - 255)) * (cp - 255) + 151);
    else if (cp <= 424) aqiPm10 = Math.round(((300 - 201) / (424 - 355)) * (cp - 355) + 201);
    else if (cp <= 504) aqiPm10 = Math.round(((400 - 301) / (504 - 425)) * (cp - 425) + 301);
    else aqiPm10 = 500;
  }

  return Math.max(aqiPm25, aqiPm10);
};

/**
 * Maps standard numerical AQI to qualitative status descriptor
 */
export const getAqiStatusFromAqi = (aqi = 50) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 150) return 'Moderate';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Severe';
};

/**
 * Calculates scientific dew point using standard Magnus formula
 */
const calculateDewPoint = (tempC, humidity) => {
  if (tempC == null || humidity == null) return Math.round(tempC - 5);
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(Math.max(humidity, 1) / 100);
  return Math.round((b * alpha) / (a - alpha));
};

/**
 * Formats epoch timestamp in seconds according to city's specific UTC timezone offset
 */
export const getCityTimeFromEpoch = (epochSec, timezoneOffsetSec) => {
  if (!epochSec) return '06:00 AM';
  const utc = (epochSec * 1000) + (new Date().getTimezoneOffset() * 60 * 1000);
  const cityTime = new Date(utc + (timezoneOffsetSec * 1000));
  return cityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

/**
 * Gets city's current local time formatted according to its UTC offset
 */
export const getCityLocalTime = (timezoneOffsetSec, lang = 'en') => {
  const nowUtc = Date.now() + (new Date().getTimezoneOffset() * 60 * 1000);
  const cityTime = new Date(nowUtc + ((timezoneOffsetSec || 0) * 1000));
  return cityTime.toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Bidirectional Hindi-to-English common city name dictionary
 */
export const HINDI_TO_ENGLISH_CITY = {
  'नई दिल्ली': 'New Delhi',
  'दिल्ली': 'Delhi',
  'मुंबई': 'Mumbai',
  'बेंगलुरु': 'Bengaluru',
  'बैंगलोर': 'Bengaluru',
  'कोलकाता': 'Kolkata',
  'चेन्नई': 'Chennai',
  'अहमदाबाद': 'Ahmedabad',
  'सूरत': 'Surat',
  'जयपुर': 'Jaipur',
  'हैदराबाद': 'Hyderabad',
  'पुणे': 'Pune',
  'लखनऊ': 'Lucknow',
  'कानपुर': 'Kanpur',
  'नागपुर': 'Nagpur',
  'इंदौर': 'Indore',
  'भोपाल': 'Bhopal',
  'पटना': 'Patna',
  'वडोदरा': 'Vadodara',
  'राजकोट': 'Rajkot',
  'वाराणसी': 'Varanasi',
  'श्रीनगर': 'Srinagar',
  'चंडीगढ़': 'Chandigarh',
  'कोच्चि': 'Kochi',
  'आगरा': 'Agra',
  'अमृतसर': 'Amritsar',
  'लंदन': 'London',
  'न्यूयॉर्क': 'New York',
  'टोक्यो': 'Tokyo',
  'दुबई': 'Dubai',
  'पेरिस': 'Paris',
  'टोरंटो': 'Toronto',
  'सिडनी': 'Sydney',
};

/**
 * Fetches dynamic city suggestions from OpenWeather Geocoding API
 */
export const fetchCitySuggestions = async (rawQuery) => {
  if (!rawQuery || rawQuery.trim().length < 2) return [];
  const config = getWeatherApiConfig();
  if (!config.hasKey) return [];

  const query = HINDI_TO_ENGLISH_CITY[rawQuery.trim()] || rawQuery.trim();

  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${config.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const list = await res.json();
    if (!Array.isArray(list)) return [];

    return list.map(item => ({
      name: item.name,
      state: item.state || '',
      country: item.country || '',
      lat: item.lat,
      lon: item.lon,
      label: `${item.name}${item.state ? ', ' + item.state : ''}, ${item.country}`,
    }));
  } catch (err) {
    console.warn('[OpenWeather] Geocoding suggestion error:', err.message);
    return [];
  }
};

/**
 * Primary Asynchronous Weather Fetch Function
 * 
 * Hits OpenWeatherMap REST API directly:
 * - /weather: Current meteorological data
 * - /forecast: 5-day / 3-hour forecast for calculating true day High & Low
 * - /air_pollution: Atmospheric components (PM2.5, PM10) for official AQI
 * 
 * @param {string|Object} target City name string or { lat, lon }
 * @returns {Promise<Object>} Formatted weather object adhering to project curriculum
 */
export const fetchWeatherData = async (target) => {
  const config = getWeatherApiConfig();
  const apiKey = config.apiKey;

  let weatherUrl = '';
  let forecastUrl = '';
  let displayName = '';

  if (typeof target === 'object' && target !== null && target.lat != null && target.lon != null) {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${target.lat}&lon=${target.lon}&units=metric&appid=${apiKey}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${target.lat}&lon=${target.lon}&units=metric&appid=${apiKey}`;
    displayName = target.name || `${target.lat.toFixed(2)}, ${target.lon.toFixed(2)}`;
  } else {
    let query = String(target || '').trim();
    if (HINDI_TO_ENGLISH_CITY[query]) {
      query = HINDI_TO_ENGLISH_CITY[query];
    } else if (HINDI_TO_ENGLISH_CITY[query.toLowerCase()]) {
      query = HINDI_TO_ENGLISH_CITY[query.toLowerCase()];
    }
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`;
    displayName = query;
  }

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl).catch(() => null),
    ]);

    if (!weatherRes.ok) {
      const errorData = await weatherRes.json().catch(() => ({}));
      if (weatherRes.status === 404) {
        throw new Error(`No such place exists in our API: "${displayName}". Please verify spelling.`);
      }
      throw new Error(errorData.message || `OpenWeather request failed with status ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const forecastData = forecastRes && forecastRes.ok ? await forecastRes.json() : null;

    // Fetch OpenWeather Air Pollution if coordinates are present
    let airPollutionData = null;
    if (weatherData.coord?.lat != null && weatherData.coord?.lon != null) {
      try {
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`;
        const aqiRes = await fetch(aqiUrl);
        if (aqiRes.ok) {
          airPollutionData = await aqiRes.json();
        }
      } catch {
        // Non-critical
      }
    }

    // Extract true today High and Low from forecast slots
    const next24hSlots = (forecastData?.list || []).slice(0, 8);
    const forecastTemps = next24hSlots.map(s => s.main?.temp).filter(t => t != null);
    const tempMin = forecastTemps.length ? Math.round(Math.min(...forecastTemps, weatherData.main.temp)) : Math.round(weatherData.main.temp_min);
    const tempMax = forecastTemps.length ? Math.round(Math.max(...forecastTemps, weatherData.main.temp)) : Math.round(weatherData.main.temp_max);

    // Extract OpenWeather air pollution components
    const polItem = airPollutionData?.list?.[0];
    const components = polItem?.components || {};
    const pm25 = components.pm2_5 != null ? Math.round(components.pm2_5 * 10) / 10 : 25.0;
    const pm10 = components.pm10 != null ? Math.round(components.pm10 * 10) / 10 : 45.0;
    const no2 = components.no2 != null ? Math.round(components.no2 * 10) / 10 : 18.0;
    const o3 = components.o3 != null ? Math.round(components.o3 * 10) / 10 : 35.0;
    const so2 = components.so2 != null ? Math.round(components.so2 * 10) / 10 : 8.0;
    const co = components.co != null ? Math.round(components.co / 100) / 10 : 0.8;

    // Calculate official AQI (e.g. 159 for New Delhi)
    const aqi = calculateOfficialAqi(pm25, pm10);
    const aqiStatus = getAqiStatusFromAqi(aqi);

    const description = weatherData.weather?.[0]?.description || 'Clear sky';
    const weatherMain = weatherData.weather?.[0]?.main || 'Clear';
    const capitalizedDescription = description.charAt(0).toUpperCase() + description.slice(1);

    const dewPoint = calculateDewPoint(weatherData.main.temp, weatherData.main.humidity);
    const localTime = getCityLocalTime(weatherData.timezone);
    const sunrise = getCityTimeFromEpoch(weatherData.sys?.sunrise, weatherData.timezone);
    const sunset = getCityTimeFromEpoch(weatherData.sys?.sunset, weatherData.timezone);

    // Build Hourly Forecast (Next 8 slots / 24 hours)
    const rawForecastList = forecastData?.list || [];
    const hourlyForecast = rawForecastList.slice(0, 8).map(slot => {
      const slotTime = new Date((slot.dt * 1000) + (weatherData.timezone * 1000) + (new Date().getTimezoneOffset() * 60 * 1000));
      return {
        time: slotTime.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        temp: Math.round(slot.main.temp),
        feelsLike: Math.round(slot.main.feels_like),
        weather: slot.weather?.[0]?.description || 'Clear',
        iconCode: slot.weather?.[0]?.icon || '01d',
        rainChance: Math.round((slot.pop || 0) * 100),
        humidity: slot.main.humidity,
        windSpeed: Math.round((slot.wind?.speed || 0) * 3.6),
      };
    });

    // Build 5-Day Daily Forecast by grouping daily slots
    const dayGroups = {};
    rawForecastList.forEach(slot => {
      const dateKey = slot.dt_txt ? slot.dt_txt.split(' ')[0] : new Date(slot.dt * 1000).toISOString().split('T')[0];
      if (!dayGroups[dateKey]) {
        dayGroups[dateKey] = [];
      }
      dayGroups[dateKey].push(slot);
    });

    const dailyForecast = Object.entries(dayGroups).slice(0, 5).map(([dateStr, slots], idx) => {
      const temps = slots.map(s => s.main.temp);
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));
      const midSlot = slots[Math.floor(slots.length / 2)] || slots[0];
      const dateObj = new Date(dateStr + 'T12:00:00');
      const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const maxPop = Math.round(Math.max(...slots.map(s => s.pop || 0)) * 100);

      return {
        day: dayName,
        date: formattedDate,
        tempMin: minTemp,
        tempMax: maxTemp,
        weather: midSlot.weather?.[0]?.description || 'Clear',
        weatherMain: midSlot.weather?.[0]?.main || 'Clear',
        iconCode: midSlot.weather?.[0]?.icon || '01d',
        humidity: midSlot.main.humidity,
        rainChance: maxPop,
        windSpeed: Math.round((midSlot.wind?.speed || 0) * 3.6),
      };
    });

    return {
      city: weatherData.name,
      country: weatherData.sys?.country || 'IN',
      temp: Math.round(weatherData.main.temp),
      tempMin,
      tempMax,
      humidity: weatherData.main.humidity,
      feelsLike: Math.round(weatherData.main.feels_like),
      weather: capitalizedDescription,
      weatherMain,
      iconCode: weatherData.weather?.[0]?.icon || '01d',
      windSpeed: Math.round(weatherData.wind?.speed * 3.6), // in km/h
      windSpeedRaw: weatherData.wind?.speed || 0, // in m/s
      windDeg: weatherData.wind?.deg || 0,
      pressure: weatherData.main?.pressure || 1012,
      visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : 10,
      dewPoint,
      localTime,
      sunrise,
      sunset,
      timezone: weatherData.timezone,
      aqi,
      aqiStatus,
      pm25: `${pm25} µg/m³`,
      pm10: `${pm10} µg/m³`,
      pollutants: {
        pm25,
        pm10,
        no2,
        o3,
        so2,
        co,
      },
      coordinates: weatherData.coord,
      hourlyForecast,
      dailyForecast,
    };
  } catch (error) {
    console.error('[OpenWeather API Error]:', error.message);
    throw error;
  }
};
