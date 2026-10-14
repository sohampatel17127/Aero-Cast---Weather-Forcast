import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Collapse,
  Button,
  Paper,
  ButtonGroup,
  Menu,
  MenuItem,
} from '@mui/material';
import SearchBox from './SearchBox';
import InfoBox from './InfoBox';
import WeatherLogo from './WeatherLogo';
import { fetchWeatherData, getWeatherApiConfig } from '../services/weatherService';
import { TRANSLATIONS } from '../utils/translations';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * Module 5: WeatherApp Root Component & State Lifting
 * 
 * Features:
 * - Authentic User Uploaded Logo (WeatherLogo)
 * - Executive e-Samanvit inspired Navbar (no clock clutter, dropdown arrow language menu)
 * - Language Dropdown Menu (English ▾ / हिन्दी ▾)
 * - Unit Switcher (°C | °F) & Live Telemetry Feed pill
 * - Centralized application state (Single Source of Truth)
 * - Lifting state up: coordinates SearchBox and InfoBox seamlessly
 * - Unidirectional data flow (props down, updater callbacks up)
 * - Module 5 Exercise: "Last Updated" timestamp updated on every updateInfo
 * - Module 5 Exercise: Default city load routine on initial mount
 * - Module 6: Error handling via Material UI Alert notifications
 */
export const WeatherApp = () => {
  // Central application state
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [tempUnit, setTempUnit] = useState('C'); // 'C' | 'F'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('aerocast_lang') || 'en';
  });

  // Language Dropdown Menu state
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const isLangMenuOpen = Boolean(langAnchorEl);

  // Active translations dictionary
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Persist language choice
  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('aerocast_lang', newLang);
  };

  const handleOpenLangMenu = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleSelectLanguage = (newLang) => {
    handleLanguageChange(newLang);
    setLangAnchorEl(null);
  };

  const handleCloseLangMenu = () => {
    setLangAnchorEl(null);
  };

  // Format real-time timestamp
  const getFormattedTimestamp = () => {
    const now = new Date();
    return now.toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  };

  // State lifting updater callback function (Module 5)
  const updateInfo = useCallback(async (target) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let data = target;
      // If target is city string or GPS object, fetch live meteorological data
      if (typeof target === 'string' || (target && target.lat != null)) {
        data = await fetchWeatherData(target);
      }

      setWeatherInfo(data);
      // Module 5 Exercise: Update "Last Updated" timestamp
      setLastUpdated(getFormattedTimestamp());
    } catch (err) {
      // Module 6: Error state propagation
      setErrorMessage(err.message || 'No such place exists in our API! Please verify spelling.');
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  // Module 5 Exercise: Default city load routine when app mounts for the first time
  useEffect(() => {
    const config = getWeatherApiConfig();
    const defaultCity = config.defaultCity || 'New Delhi';
    updateInfo(defaultCity);
  }, [updateInfo]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F4F8FC',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top Executive Navigation Bar ───────────────────────────────── */}
      <Paper
        elevation={1}
        sx={{
          borderRadius: 0,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(13, 36, 64, 0.08)',
          py: { xs: 1, sm: 1.25 },
          px: { xs: 1.5, sm: 3 },
          position: 'sticky',
          top: 0,
          zIndex: 1100,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: 1,
            px: { xs: 0, sm: 2 },
          }}
        >
          {/* Logo & Brand Identity (Using User's Uploaded Logo) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <WeatherLogo size={34} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <WeatherLogo size={44} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                component="h1"
                noWrap
                sx={{
                  fontWeight: 800,
                  color: '#0D2440',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.1rem', sm: '1.35rem' },
                }}
              >
                {t.appTitle}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: '#506B88',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {t.appSubtitle}
              </Typography>
            </Box>
          </Box>

          {/* Right Controls: Unit Switcher & Language Dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.2 }, flexShrink: 0 }}>
            {/* Unit Selector (°C / °F) */}
            <ButtonGroup
              size="small"
              variant="outlined"
              sx={{
                bgcolor: '#F4F8FC',
                borderRadius: '8px',
                p: 0.2,
                border: '1px solid rgba(46, 94, 153, 0.25)',
              }}
            >
              <Button
                onClick={() => setTempUnit('C')}
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '0.74rem', sm: '0.82rem' },
                  textTransform: 'none',
                  px: { xs: 0.8, sm: 1.2 },
                  py: 0.3,
                  minWidth: { xs: 30, sm: 36 },
                  borderRadius: '6px !important',
                  bgcolor: tempUnit === 'C' ? '#2E5E99' : 'transparent',
                  color: tempUnit === 'C' ? '#FFFFFF' : '#506B88',
                  border: 'none !important',
                  '&:hover': {
                    bgcolor: tempUnit === 'C' ? '#1B4272' : 'rgba(46, 94, 153, 0.1)',
                  },
                }}
              >
                °C
              </Button>
              <Button
                onClick={() => setTempUnit('F')}
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '0.74rem', sm: '0.82rem' },
                  textTransform: 'none',
                  px: { xs: 0.8, sm: 1.2 },
                  py: 0.3,
                  minWidth: { xs: 30, sm: 36 },
                  borderRadius: '6px !important',
                  bgcolor: tempUnit === 'F' ? '#2E5E99' : 'transparent',
                  color: tempUnit === 'F' ? '#FFFFFF' : '#506B88',
                  border: 'none !important',
                  '&:hover': {
                    bgcolor: tempUnit === 'F' ? '#1B4272' : 'rgba(46, 94, 153, 0.1)',
                  },
                }}
              >
                °F
              </Button>
            </ButtonGroup>

            {/* Language Dropdown Button with Down Arrow */}
            <Box>
              <Button
                onClick={handleOpenLangMenu}
                endIcon={<KeyboardArrowDownIcon sx={{ color: '#2E5E99', fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
                sx={{
                  bgcolor: '#F4F8FC',
                  color: '#0D2440',
                  fontWeight: 700,
                  fontSize: { xs: '0.78rem', sm: '0.85rem' },
                  textTransform: 'none',
                  px: { xs: 1, sm: 1.4 },
                  py: 0.4,
                  borderRadius: '8px',
                  border: '1px solid rgba(46, 94, 153, 0.25)',
                  '&:hover': {
                    bgcolor: '#E7F0FA',
                    borderColor: '#2E5E99',
                  },
                }}
              >
                {lang === 'hi' ? 'हिन्दी' : 'English'}
              </Button>

              <Menu
                anchorEl={langAnchorEl}
                open={isLangMenuOpen}
                onClose={handleCloseLangMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    elevation: 4,
                    sx: {
                      borderRadius: '8px',
                      mt: 0.8,
                      minWidth: 120,
                      border: '1px solid rgba(13, 36, 64, 0.08)',
                    },
                  },
                }}
              >
                <MenuItem
                  selected={lang === 'en'}
                  onClick={() => handleSelectLanguage('en')}
                  sx={{ fontWeight: lang === 'en' ? 700 : 500, fontSize: '0.88rem' }}
                >
                  English
                </MenuItem>
                <MenuItem
                  selected={lang === 'hi'}
                  onClick={() => handleSelectLanguage('hi')}
                  sx={{ fontWeight: lang === 'hi' ? 700 : 500, fontSize: '0.88rem' }}
                >
                  हिन्दी
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* ── Main Dashboard Container ───────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3.5 }, px: { xs: 1.5, sm: 3 }, flex: 1 }}>
        {/* Search & Location Section (Module 2) */}
        <SearchBox updateInfo={updateInfo} isLoading={isLoading} lang={lang} />

        {/* Module 6: Error Feedback via Material UI Alert */}
        <Collapse in={Boolean(errorMessage)}>
          <Box sx={{ maxWidth: 740, mx: 'auto', mb: 2 }}>
            <Alert
              severity="error"
              onClose={() => setErrorMessage(null)}
              sx={{
                borderRadius: '10px',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(211, 47, 47, 0.15)',
              }}
            >
              {errorMessage}
            </Alert>
          </Box>
        </Collapse>

        {/* Loading Spinner */}
        {isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 6, gap: 2 }}>
            <CircularProgress size={46} sx={{ color: '#2E5E99' }} />
            <Typography variant="body2" sx={{ color: '#506B88', fontWeight: 600 }}>
              {t.loadingText}
            </Typography>
          </Box>
        )}

        {/* Modules 4 & 6: Weather Telemetry Display & Forecasts */}
        {!isLoading && weatherInfo && (
          <InfoBox
            info={weatherInfo}
            tempUnit={tempUnit}
            onUnitToggle={(newUnit) => setTempUnit(newUnit)}
            lang={lang}
          />
        )}

        {/* Module 5 Exercise: "Last Updated" Status Bar */}
        {lastUpdated && (
          <Box sx={{ textAlign: 'center', mt: 1.5, mb: 2.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                color: '#506B88',
                fontWeight: 600,
                bgcolor: '#FFFFFF',
                px: 2,
                py: 0.8,
                borderRadius: 99,
                border: '1px solid rgba(13, 36, 64, 0.08)',
                display: 'inline-block',
                boxShadow: '0 2px 8px rgba(13, 36, 64, 0.04)',
              }}
            >
              {t.telemetryUpdated}: {lastUpdated}
            </Typography>
          </Box>
        )}

      </Container>

      {/* ── Weather Portal Executive Footer ───────────────────────────── */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#0D2440',
          color: '#FFFFFF',
          pt: { xs: 3, sm: 4 },
          pb: { xs: 2.5, sm: 3 },
          px: { xs: 2, sm: 4 },
          mt: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1.5fr 1fr 1fr' },
              gap: { xs: 3, sm: 4 },
              pb: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {/* Column 1: Brand & Weather Mission */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <WeatherLogo size={38} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  {t.appTitle}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#B4CBE2', lineHeight: 1.6, maxWidth: 360 }}>
                {lang === 'hi'
                  ? 'सटीक 24-घंटे का वायुमंडलीय पूर्वानुमान, 5-दिवसीय दृष्टिकोण और वास्तविक समय में वैश्विक शहरों की वायु गुणवत्ता निगरानी।'
                  : 'High-precision meteorological telemetry, 24-hour timeline, 5-day outlook, and global air quality intelligence.'}
              </Typography>
            </Box>

            {/* Column 2: Meteorological Capabilities */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#7BA4D0', mb: 1.5, textTransform: 'uppercase', fontSize: '0.78rem' }}>
                {lang === 'hi' ? 'मौसम सेवाएं' : 'Weather Intelligence'}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Typography variant="caption" sx={{ color: '#E7F0FA', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🌤️</span> {lang === 'hi' ? 'रीयल-टाइम मौसम टेलीमेट्री' : 'Live Atmospheric Telemetry'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#E7F0FA', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>⏱️</span> {lang === 'hi' ? '24-घंटे प्रति घंटा पूर्वानुमान' : '24-Hour Hourly Timeline'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#E7F0FA', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>📅</span> {lang === 'hi' ? '5-दिवसीय मौसम दृष्टिकोण' : '5-Day Meteorological Outlook'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#E7F0FA', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🛡️</span> {lang === 'hi' ? 'यूएस ईपीए वायु गुणवत्ता (AQI)' : 'US EPA Air Quality Index'}
                </Typography>
              </Box>
            </Box>

            {/* Column 3: Data Integrity & Telemetry Source */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#7BA4D0', mb: 1.5, textTransform: 'uppercase', fontSize: '0.78rem' }}>
                {lang === 'hi' ? 'डेटा विश्वसनीयता' : 'Data Standards'}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Typography variant="caption" sx={{ color: '#B4CBE2' }}>
                  • {lang === 'hi' ? 'ग्लोबल वेदर स्टेशन नेटवर्क' : 'Global Weather Station Telemetry'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B4CBE2' }}>
                  • {lang === 'hi' ? 'सटीक खगोलीय सौर गणना' : 'Astronomical Solar Coordinates'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B4CBE2' }}>
                  • {lang === 'hi' ? 'आर्द्रता एवं ओस बिंदु विश्लेषण' : 'Dew Point & Barometric Synthesis'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B4CBE2' }}>
                  • {lang === 'hi' ? 'जीपीएस आधारित स्थानीय समय' : 'GPS Synchronized Local Time'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Bottom Copyright & Status Bar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              pt: 2.5,
            }}
          >
            <Typography variant="caption" sx={{ color: '#7BA4D0' }}>
              © 2026 {t.appTitle} Meteorological Portal. {lang === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
            </Typography>

            <Typography variant="caption" sx={{ color: '#B4CBE2' }}>
              {lang === 'hi' ? 'विश्वसनीय मौसम पूर्वानुमान सेवा' : 'Engineered for Precision Weather Intelligence'}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default WeatherApp;
