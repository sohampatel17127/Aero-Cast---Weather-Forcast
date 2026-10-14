/**
 * AeroCast — Comprehensive Bilingual (English & Hindi) Translation Dictionary
 */

export const TRANSLATIONS = {
  en: {
    // Brand & Header
    appTitle: 'AeroCast',
    appSubtitle: 'Atmospheric Weather Telemetry Portal',
    liveTelemetry: 'Live Telemetry',
    stationActive: 'Station Active',
    localTimeIn: 'Local Time in',
    telemetryUpdated: 'Telemetry Last Updated',
    
    // Search Box
    searchLabel: 'City Name',
    searchPlaceholder: 'Enter city name (e.g. Surat, Mumbai, London, Tokyo)...',
    searchButton: 'Search',
    searching: 'Searching...',
    quickPicks: 'Quick Picks:',
    currentLocation: 'Use Current GPS Location',
    emptyError: 'City name cannot be empty or contain only whitespace.',
    shortError: 'Search query must be at least 2 characters.',
    geoError: 'Unable to detect location. Please check browser permissions or type your city.',
    
    // Units & Controls
    language: 'Language',
    unitLabel: 'Unit',
    celsius: 'Celsius',
    fahrenheit: 'Fahrenheit',
    
    // Main Hero Weather Card
    feelsLike: 'Feels like',
    todayRange: "Today's Range",
    min: 'Min',
    max: 'Max',
    coordinates: 'Coordinates',
    highlightRed: 'Highlighted in RED: High temperature alert exceeding 30°C',
    highlightBlue: 'Highlighted in BLUE: Low temperature alert below 10°C',
    moderateTemp: 'Moderate Temperature: Within standard comfort range (10°C - 30°C)',
    
    // Primary Telemetry
    humidity: 'HUMIDITY',
    windSpeed: 'WIND SPEED',
    barometer: 'BAROMETER',
    visibility: 'VISIBILITY',
    
    // Timelines & Forecasts
    hourlyTitle: '24-Hour Atmospheric Timeline',
    hourlySubtitle: 'Live 3-Hour Interval Feeds',
    now: 'Now',
    rainChance: 'rain',
    forecastTitle: '5-Day Meteorological Outlook',
    forecastSubtitle: 'OpenWeather Multi-Day Synthesis',
    today: 'Today',
    
    // Detailed Environmental Cards
    aqiTitle: 'Air Quality & Pollutants',
    aqiStandard: 'US EPA / CPCB Standard Index',
    aqiGood: 'Good',
    aqiSatisfactory: 'Satisfactory',
    aqiModerate: 'Moderate',
    aqiUnhealthy: 'Unhealthy',
    aqiVeryUnhealthy: 'Very Unhealthy',
    aqiSevere: 'Severe',
    
    sunCycleTitle: 'Sun Cycle & Daylight',
    sunrise: 'SUNRISE',
    sunset: 'SUNSET',
    sunCalcNote: 'Calculated precisely using astronomical solar coordinates',
    
    windTitle: 'Wind & Aerodynamics',
    windBearing: 'WIND BEARING',
    airPressure: 'AIR PRESSURE',
    pressureNormal: 'Normal',
    
    moistureTitle: 'Moisture & Visibility',
    relativeHumidity: 'Relative Humidity',
    dewPoint: 'DEW POINT',
    sightDistance: 'SIGHT DISTANCE',
    sightClear: 'Clear',
    
    // Module 1 Exercise
    module1Title: 'Module 1 Hands-on Exercise: Material UI Button Primitives',
    showModule1: 'View Module 1 Hands-on Button Exercise',
    hideModule1: 'Hide Module 1 Button Component Exercise',
    btnDelete: 'Delete',
    btnSubmit: 'Submit',
    btnDisabled: 'Disabled',
    
    // Footer
    footerCredit: 'React + Material UI + OpenWeatherMap REST API',
    footerSubtext: 'Real-time Global Meteorological Telemetry • EPA/CPCB Air Quality Standard',
    loadingText: 'Acquiring atmospheric telemetry from OpenWeatherMap...',
  },

  hi: {
    // Brand & Header
    appTitle: 'एयरोकास्ट',
    appSubtitle: 'वायुमंडलीय मौसम टेलीमेट्री पोर्टल',
    liveTelemetry: 'लाइव टेलीमेट्री',
    stationActive: 'स्टेशन सक्रिय',
    localTimeIn: 'स्थानीय समय',
    telemetryUpdated: 'टेलीमेट्री अंतिम अपडेट',
    
    // Search Box
    searchLabel: 'शहर का नाम',
    searchPlaceholder: 'शहर का नाम दर्ज करें (उदा. सूरत, मुंबई, दिल्ली, लंदन)...',
    searchButton: 'खोजें',
    searching: 'खोज जारी है...',
    quickPicks: 'त्वरित शहर:',
    currentLocation: 'वर्तमान जीपीएस स्थान का उपयोग करें',
    emptyError: 'शहर का नाम खाली या केवल रिक्त स्थान नहीं हो सकता।',
    shortError: 'कम से कम 2 अक्षर दर्ज करें।',
    geoError: 'स्थान का पता नहीं लगा सके। कृपया ब्राउज़र अनुमति जांचें या नाम टाइप करें।',
    
    // Units & Controls
    language: 'भाषा',
    unitLabel: 'इकाई',
    celsius: 'सेल्सियस',
    fahrenheit: 'फ़ारेनहाइट',
    
    // Main Hero Weather Card
    feelsLike: 'महसूस हो रहा है',
    todayRange: 'आज का तापमान',
    min: 'न्यूनतम',
    max: 'अधिकतम',
    coordinates: 'भौगोलिक निर्देशांक',
    highlightRed: 'लाल रंग में हाइलाइट: 30°C से अधिक उच्च तापमान चेतावनी',
    highlightBlue: 'नीले रंग में हाइलाइट: 10°C से कम ठंडा तापमान चेतावनी',
    moderateTemp: 'सामान्य तापमान: अनुकूल मौसम सीमा (10°C - 30°C)',
    
    // Primary Telemetry
    humidity: 'आर्द्रता (नमी)',
    windSpeed: 'हवा की गति',
    barometer: 'वायुमंडलीय दबाव',
    visibility: 'दृश्यता',
    
    // Timelines & Forecasts
    hourlyTitle: '24-घंटे का वायुमंडलीय पूर्वानुमान',
    hourlySubtitle: 'लाइव 3-घंटे अंतराल फ़ीड्स',
    now: 'अभी',
    rainChance: 'बारिश',
    forecastTitle: '5-दिवसीय मौसम दृष्टिकोण',
    forecastSubtitle: 'ओपनवेदर बहु-दिवसीय विश्लेषण',
    today: 'आज',
    
    // Detailed Environmental Cards
    aqiTitle: 'वायु गुणवत्ता और प्रदूषक (AQI)',
    aqiStandard: 'यूएस ईपीए / सीपीसीबी मानक सूचकांक',
    aqiGood: 'उत्कृष्ट (Good)',
    aqiSatisfactory: 'संतोषजनक (Satisfactory)',
    aqiModerate: 'मध्यम (Moderate)',
    aqiUnhealthy: 'अस्वस्थ (Unhealthy)',
    aqiVeryUnhealthy: 'अत्यंत अस्वस्थ (Very Unhealthy)',
    aqiSevere: 'गंभीर (Severe)',
    
    sunCycleTitle: 'सौर चक्र और दिन का प्रकाश',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    sunCalcNote: 'खगोलीय सौर निर्देशांकों द्वारा सटीक गणना',
    
    windTitle: 'वायु और दिशा विज्ञान',
    windBearing: 'पवन कोण (दिशा)',
    airPressure: 'वायु दबाव',
    pressureNormal: 'सामान्य',
    
    moistureTitle: 'आर्द्रता, ओस और दृश्यता',
    relativeHumidity: 'सापेक्ष आर्द्रता',
    dewPoint: 'ओस बिंदु (Dew Point)',
    sightDistance: 'दृष्टि दूरी',
    sightClear: 'स्पष्ट',
    
    // Module 1 Exercise
    module1Title: 'मॉड्यूल 1 हैंड्स-ऑन अभ्यास: मटेरियल यूआई बटन घटक',
    showModule1: 'मॉड्यूल 1 बटन अभ्यास देखें',
    hideModule1: 'मॉड्यूल 1 बटन अभ्यास छिपाएं',
    btnDelete: 'हटाएं (Delete)',
    btnSubmit: 'जमा करें (Submit)',
    btnDisabled: 'अक्षम (Disabled)',
    
    // Footer
    footerCredit: 'रिएक्ट + मटेरियल यूआई + ओपनवेदरमैप रेस्ट एपीआई',
    footerSubtext: 'रीयल-टाइम वैश्विक मौसम टेलीमेट्री • ईपीए / सीपीसीबी वायु गुणवत्ता मानक',
    loadingText: 'ओपनवेदरमैप से मौसम टेलीमेट्री प्राप्त की जा रही है...',
  },
};

/**
 * Translates weather condition descriptions into Hindi if Hindi is active
 */
export const translateWeatherDescription = (description, lang = 'en') => {
  if (!description) return '';
  if (lang !== 'hi') return description;

  const descLower = description.toLowerCase().trim();

  const weatherDict = {
    'clear sky': 'साफ़ आसमान',
    'few clouds': 'हल्के बादल',
    'scattered clouds': 'बिखरे हुए बादल',
    'broken clouds': 'आंशिक रूप से बादल छाए हुए',
    'overcast clouds': 'घने बादल',
    'shower rain': 'तेज बौछारें',
    'light rain': 'हल्की बारिश',
    'moderate rain': 'मध्यम बारिश',
    'heavy intensity rain': 'भारी बारिश',
    'very heavy rain': 'मूसलाधार बारिश',
    'extreme rain': 'अत्यधिक बारिश',
    'freezing rain': 'बर्फ़ीली बारिश',
    'light intensity shower rain': 'हल्की बौछारें',
    'heavy intensity shower rain': 'भारी बौछारें',
    'ragged shower rain': 'रुक-रुक कर बौछारें',
    'rain': 'बारिश',
    'thunderstorm': 'आंधी-तूफान',
    'thunderstorm with light rain': 'गरज के साथ हल्की बारिश',
    'thunderstorm with rain': 'गरज के साथ बारिश',
    'thunderstorm with heavy rain': 'गरज के साथ भारी बारिश',
    'snow': 'बर्फबारी',
    'light snow': 'हल्की बर्फबारी',
    'heavy snow': 'भारी बर्फबारी',
    'sleet': 'ओलावृष्टि',
    'mist': 'कोहरा (Mist)',
    'smoke': 'धुआं (Smoke)',
    'haze': 'धुंध (Haze)',
    'sand/dust whirls': 'धूल भरी आंधी',
    'fog': 'घना कोहरा (Fog)',
    'sand': 'रेत',
    'dust': 'धूल',
    'volcanic ash': 'ज्वालामुखीय राख',
    'squalls': 'झक्कड़ / तेज हवाएं',
    'tornado': 'बवंडर (Tornado)',
  };

  return weatherDict[descLower] || description;
};
