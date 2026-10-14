import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import ShieldIcon from '@mui/icons-material/Shield';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import NavigationIcon from '@mui/icons-material/Navigation';
import OpacityIcon from '@mui/icons-material/Opacity';
import { TRANSLATIONS, translateWeatherDescription } from '../utils/translations';
import { getCityLocalTime } from '../services/weatherService';

/**
 * Module 4 & 6: Weather InfoBox Component
 * 
 * Features:
 * - Built using Material UI Card primitives (Card, CardContent, Typography)
 * - Module 4 Hands-on Exercise: Main temperature highlighted in RED (>30°C) and BLUE (<10°C)
 * - Dynamic Weather Icons (WbSunny, Thunderstorm, AcUnit)
 * - Celsius (°C) / Fahrenheit (°F) toggle switch
 * - Clean executive card without landscape image clutter
 * - 24-Hour Hourly timeline with precipitation probability
 * - 5-Day Meteorological forecast outlook with high/low temperature bars
 * - Environmental air quality breakdown (PM2.5, PM10, NO2, O3)
 * - Sunrise, Sunset, Wind Direction, Dew Point, and Barometer
 */
export const InfoBox = ({ info, tempUnit = 'C', onUnitToggle, lang = 'en' }) => {
  // Live ticking local time with seconds for the selected city
  const [liveLocalTime, setLiveLocalTime] = React.useState('');

  React.useEffect(() => {
    if (!info) return;
    const tz = info.timezone != null ? info.timezone : 19800;
    const update = () => {
      setLiveLocalTime(getCityLocalTime(tz, lang));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [info, lang]);

  if (!info) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isFahrenheit = tempUnit === 'F';
  const weatherTranslated = translateWeatherDescription(info.weather, lang);

  // Helper to convert Celsius to selected unit
  const formatTemp = (celsius) => {
    if (celsius == null) return '--';
    if (isFahrenheit) {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  // Module 4 Exercise: Highlight > 30°C in RED text and < 10°C in BLUE text
  const getTemperatureColor = (celsius) => {
    if (celsius > 30) return '#d32f2f'; // Highlighted in RED (> 30°C)
    if (celsius < 10) return '#1976d2'; // Highlighted in BLUE (< 10°C)
    return '#2E5E99'; // Default corporate azure
  };

  // Dynamic weather icon selection
  const getWeatherIcon = (tempC = info.temp, desc = info.weather, size = 32) => {
    if (tempC <= 0) {
      return <AcUnitIcon sx={{ color: '#0288d1', fontSize: size, verticalAlign: 'middle' }} />;
    }
    const weatherLower = (desc || '').toLowerCase();
    if (info.humidity >= 80 || weatherLower.includes('rain') || weatherLower.includes('storm')) {
      return <ThunderstormIcon sx={{ color: '#455a64', fontSize: size, verticalAlign: 'middle' }} />;
    }
    if (tempC > 15) {
      return <WbSunnyIcon sx={{ color: '#f57c00', fontSize: size, verticalAlign: 'middle' }} />;
    }
    return <AcUnitIcon sx={{ color: '#0288d1', fontSize: size, verticalAlign: 'middle' }} />;
  };

  const mainTempColor = getTemperatureColor(info.temp);

  // AQI color palette and translation
  const getAqiDetails = (aqi) => {
    if (aqi <= 50) return { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7', label: t.aqiGood };
    if (aqi <= 100) return { bg: '#fffde7', text: '#f57f17', border: '#fff59d', label: t.aqiSatisfactory };
    if (aqi <= 150) return { bg: '#fff3e0', text: '#e65100', border: '#ffcc80', label: t.aqiModerate };
    if (aqi <= 200) return { bg: '#ffebee', text: '#c62828', border: '#ef9a9a', label: t.aqiUnhealthy };
    if (aqi <= 300) return { bg: '#f3e5f5', text: '#6a1b9a', border: '#ce93d8', label: t.aqiVeryUnhealthy };
    return { bg: '#efebe9', text: '#4e342e', border: '#bcaaa4', label: t.aqiSevere };
  };

  const aqiStyle = getAqiDetails(info.aqi || 50);

  return (
    <Box sx={{ width: '100%', maxWidth: 960, mx: 'auto', mb: 3 }}>
      {/* Sub-bar: Local Time Status & Unit Toggle */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          px: { xs: 0.5, sm: 1 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: '#FFFFFF',
            px: { xs: 1.2, sm: 1.5 },
            py: 0.6,
            borderRadius: 99,
            border: '1px solid rgba(13, 36, 64, 0.08)',
            boxShadow: '0 2px 6px rgba(13, 36, 64, 0.03)',
          }}
        >
          <Box className="live-pulse-dot" />
          <Typography variant="caption" sx={{ color: '#506B88', fontWeight: 600, fontSize: { xs: '0.78rem', sm: '0.82rem' } }}>
            {info.city}:{' '}
            <strong style={{ fontFamily: '"JetBrains Mono", monospace', color: '#0D2440' }}>
              {liveLocalTime || info.localTime || '--:--'}
            </strong>
          </Typography>
        </Box>

        {/* Module 6 Exercise: Celsius / Fahrenheit Toggle Switch */}
        <FormControlLabel
          sx={{ mr: 0 }}
          control={
            <Switch
              size="small"
              checked={isFahrenheit}
              onChange={(e) => onUnitToggle && onUnitToggle(e.target.checked ? 'F' : 'C')}
              color="primary"
            />
          }
          label={
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0D2440', fontSize: '0.8rem' }}>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{t.unitLabel}: </Box>
              <strong>°{tempUnit}</strong> ({isFahrenheit ? t.fahrenheit : t.celsius})
            </Typography>
          }
        />
      </Box>

      {/* ========================================================================= */}
      {/* 1. HERO WEATHER CARD (Clean Executive Styling - Real App Feel)            */}
      {/* ========================================================================= */}
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          background: '#FFFFFF',
          border: '1px solid rgba(13, 36, 64, 0.08)',
          boxShadow: '0 8px 30px rgba(13, 36, 64, 0.06)',
          mb: 2.5,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
          {/* Header Bar: City Name, Country, Dynamic Icon, Weather Pill, and AQI Badge */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    color: '#0D2440',
                    fontSize: { xs: '1.65rem', sm: '2.4rem' },
                    lineHeight: 1.2,
                  }}
                >
                  {info.city}
                </Typography>
                <Chip
                  label={info.country}
                  size="small"
                  sx={{ bgcolor: '#E7F0FA', color: '#2E5E99', fontWeight: 700, borderRadius: '6px', fontSize: '0.8rem', height: 24 }}
                />
                
                {/* Weather Condition Badge with Icon */}
                <Chip
                  icon={getWeatherIcon(info.temp, info.weather, 18)}
                  label={weatherTranslated}
                  size="small"
                  sx={{
                    bgcolor: '#F4F8FC',
                    color: '#0D2440',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    border: '1px solid rgba(46, 94, 153, 0.2)',
                    pl: 0.5,
                    height: 24,
                  }}
                />
              </Box>

              <Typography variant="caption" sx={{ color: '#506B88', mt: 0.5, display: 'block', fontSize: '0.75rem' }}>
                {t.coordinates}: {info.coordinates?.lat?.toFixed(2)}°N, {info.coordinates?.lon?.toFixed(2)}°E • {t.stationActive}
              </Typography>
            </Box>

            {/* EPA Air Quality Badge */}
            {info.aqi != null && (
              <Chip
                icon={<ShieldIcon sx={{ fontSize: 16 }} />}
                label={`AQI: ${info.aqi} • ${aqiStyle.label}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '0.8rem', sm: '0.88rem' },
                  bgcolor: aqiStyle.bg,
                  color: aqiStyle.text,
                  border: `1px solid ${aqiStyle.border}`,
                  px: 0.8,
                  py: 1.8,
                  borderRadius: 2,
                  alignSelf: { xs: 'flex-start', sm: 'auto' },
                }}
              />
            )}
          </Box>

          {/* Main Temperature Row (Module 4 Exercise: Color Highlighted) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 }, my: { xs: 1.5, sm: 2.5 }, flexWrap: 'wrap' }}>
            <Typography
              variant="h1"
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '3.2rem', sm: '4.8rem' },
                color: mainTempColor,
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {formatTemp(info.temp)}°{tempUnit}
            </Typography>

            <Box>
              <Typography variant="h6" sx={{ color: '#0D2440', fontWeight: 700, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                {t.feelsLike} <strong>{formatTemp(info.feelsLike)}°{tempUnit}</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: '#506B88', fontWeight: 600, fontSize: { xs: '0.82rem', sm: '0.9rem' }, mt: 0.3 }}>
                {t.todayRange}: {formatTemp(info.tempMin)}° ({t.min}) / {formatTemp(info.tempMax)}°{tempUnit} ({t.max})
              </Typography>
            </Box>
          </Box>

          {/* Module 4 Hands-on Color Indicator Notice */}
          <Box sx={{ bgcolor: '#F4F8FC', p: { xs: 1, sm: 1.5 }, borderRadius: 2, mb: 2.5, borderLeft: `4px solid ${mainTempColor}` }}>
            <Typography variant="caption" sx={{ color: '#0D2440', fontWeight: 600, display: 'block', fontSize: '0.78rem' }}>
              {info.temp > 30 ? (
                <span style={{ color: '#d32f2f' }}>
                  ● {t.highlightRed}
                </span>
              ) : info.temp < 10 ? (
                <span style={{ color: '#1976d2' }}>
                  ● {t.highlightBlue}
                </span>
              ) : (
                <span style={{ color: '#2E5E99' }}>
                  ● {t.moderateTemp}
                </span>
              )}
            </Typography>
          </Box>

          {/* Primary Quick Telemetry Tiles (Native App Tiles) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
              gap: 1.5,
              pt: 2,
              borderTop: '1px solid rgba(13, 36, 64, 0.08)',
            }}
          >
            <Box sx={{ p: { xs: 1.2, sm: 1.5 }, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid rgba(13, 36, 64, 0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4 }}>
                <WaterDropIcon sx={{ color: '#2E5E99', fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="caption" sx={{ color: '#506B88', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  {t.humidity}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#0D2440', fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
                {info.humidity}%
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 1.2, sm: 1.5 }, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid rgba(13, 36, 64, 0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4 }}>
                <AirIcon sx={{ color: '#2E5E99', fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="caption" sx={{ color: '#506B88', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  {t.windSpeed}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#0D2440', fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
                {info.windSpeed} km/h
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 1.2, sm: 1.5 }, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid rgba(13, 36, 64, 0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4 }}>
                <CompressIcon sx={{ color: '#2E5E99', fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="caption" sx={{ color: '#506B88', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  {t.barometer}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#0D2440', fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
                {info.pressure || 1012} hPa
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 1.2, sm: 1.5 }, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid rgba(13, 36, 64, 0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4 }}>
                <VisibilityIcon sx={{ color: '#2E5E99', fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="caption" sx={{ color: '#506B88', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                  {t.visibility}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#0D2440', fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
                {info.visibility} km
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 2. HOURLY 24-HOUR FORECAST TIMELINE                                       */}
      {/* ========================================================================= */}
      {info.hourlyForecast && info.hourlyForecast.length > 0 && (
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            background: '#FFFFFF',
            border: '1px solid rgba(13, 36, 64, 0.08)',
            p: { xs: 1.8, sm: 2.5 },
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
              {t.hourlyTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: '#506B88', fontWeight: 600, fontSize: '0.75rem' }}>
              {t.hourlySubtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1.2,
              overflowX: 'auto',
              pb: 0.5,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {info.hourlyForecast.map((slot, index) => (
              <Box
                key={index}
                sx={{
                  flex: '0 0 auto',
                  minWidth: { xs: 80, sm: 95 },
                  textAlign: 'center',
                  p: { xs: 1.2, sm: 1.5 },
                  borderRadius: 2,
                  bgcolor: index === 0 ? '#E7F0FA' : '#F8FAFC',
                  border: index === 0 ? '1px solid #7BA4D0' : '1px solid rgba(13, 36, 64, 0.06)',
                  transition: 'transform 0.15s ease',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: index === 0 ? '#2E5E99' : '#506B88', display: 'block', mb: 0.3, fontSize: '0.75rem' }}>
                  {index === 0 ? t.now : slot.time}
                </Typography>

                <Box sx={{ my: 0.6 }}>
                  {getWeatherIcon(slot.temp, slot.weather, 22)}
                </Box>

                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0D2440', fontSize: '0.92rem' }}>
                  {formatTemp(slot.temp)}°{tempUnit}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.3, mt: 0.6 }}>
                  <OpacityIcon sx={{ fontSize: 12, color: '#2E5E99' }} />
                  <Typography variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#2E5E99' }}>
                    {slot.rainChance}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 3. 5-DAY METEOROLOGICAL FORECAST (Flawless Single-Line Mobile Row)         */}
      {/* ========================================================================= */}
      {info.dailyForecast && info.dailyForecast.length > 0 && (
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            background: '#FFFFFF',
            border: '1px solid rgba(13, 36, 64, 0.08)',
            p: { xs: 1.8, sm: 2.5 },
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
              {t.forecastTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: '#506B88', fontWeight: 600, fontSize: '0.75rem' }}>
              {t.forecastSubtitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {info.dailyForecast.map((day, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: { xs: 1.2, sm: 1.5 },
                  borderRadius: 2,
                  bgcolor: idx === 0 ? '#F4F8FC' : '#FFFFFF',
                  border: '1px solid rgba(13, 36, 64, 0.06)',
                  gap: { xs: 1, sm: 2 },
                  transition: 'background 0.15s ease',
                  '&:hover': { bgcolor: '#F8FAFC' },
                }}
              >
                {/* Day & Date */}
                <Box sx={{ width: { xs: 68, sm: 100 }, flexShrink: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '0.88rem', sm: '0.95rem' } }}>
                    {idx === 0 ? t.today : day.day}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#506B88', fontSize: '0.72rem', display: { xs: 'none', sm: 'block' } }}>
                    {day.date}
                  </Typography>
                </Box>

                {/* Weather Condition Icon & Rain Probability */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, width: { xs: 68, sm: 100 }, flexShrink: 0 }}>
                  {getWeatherIcon(day.tempMax, day.weather, 20)}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <WaterDropIcon sx={{ fontSize: 13, color: '#2E5E99' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#2E5E99', fontSize: '0.75rem' }}>
                      {day.rainChance}%
                    </Typography>
                  </Box>
                </Box>

                {/* Weather Condition Text (Shown on larger displays) */}
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 500,
                    color: '#506B88',
                    textTransform: 'capitalize',
                    flex: 1,
                    display: { xs: 'none', md: 'block' },
                    fontSize: '0.85rem',
                  }}
                >
                  {translateWeatherDescription(day.weather, lang)}
                </Typography>

                {/* High / Low Temperature Range with Mini Bar */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.2 }, ml: 'auto', flexShrink: 0 }}>
                  <Typography variant="caption" sx={{ color: '#506B88', fontWeight: 600, width: 28, textAlign: 'right', fontSize: { xs: '0.8rem', sm: '0.88rem' } }}>
                    {formatTemp(day.tempMin)}°
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(Math.max(((day.tempMax - day.tempMin) / 15) * 100, 30), 100)}
                    sx={{
                      width: { xs: 44, sm: 70 },
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#E7F0FA',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getTemperatureColor(day.tempMax),
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0D2440', width: 44, textAlign: 'right', fontSize: { xs: '0.88rem', sm: '0.95rem' } }}>
                    {formatTemp(day.tempMax)}°{tempUnit}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. ENVIRONMENTAL TELEMETRY & AIR QUALITY CARDS (2x2 GRID)                 */}
      {/* ========================================================================= */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        {/* Card A: Air Quality Index & Detailed Pollutants */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
            background: '#FFFFFF',
            border: '1px solid rgba(13, 36, 64, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldIcon sx={{ color: '#2E5E99', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '0.98rem', sm: '1.05rem' } }}>
                {t.aqiTitle}
              </Typography>
            </Box>
            <Chip
              label={aqiStyle.label}
              size="small"
              sx={{
                bgcolor: aqiStyle.bg,
                color: aqiStyle.text,
                fontWeight: 700,
                fontSize: '0.78rem',
                border: `1px solid ${aqiStyle.border}`,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: aqiStyle.text, fontSize: { xs: '2.2rem', sm: '2.8rem' } }}>
              {info.aqi}
            </Typography>
            <Typography variant="body2" sx={{ color: '#506B88', fontWeight: 600, fontSize: '0.82rem' }}>
              {t.aqiStandard}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={Math.min((info.aqi / 300) * 100, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#ECEFF1',
              mb: 2,
              '& .MuiLinearProgress-bar': { bgcolor: aqiStyle.text, borderRadius: 4 },
            }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            <Box sx={{ p: 1, bgcolor: '#F4F8FC', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#506B88', display: 'block', fontWeight: 600, fontSize: '0.72rem' }}>
                PM2.5
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '0.82rem', sm: '0.88rem' } }}>
                {info.pollutants?.pm25 ?? 25} µg/m³
              </Typography>
            </Box>

            <Box sx={{ p: 1, bgcolor: '#F4F8FC', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#506B88', display: 'block', fontWeight: 600, fontSize: '0.72rem' }}>
                PM10
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '0.82rem', sm: '0.88rem' } }}>
                {info.pollutants?.pm10 ?? 45} µg/m³
              </Typography>
            </Box>

            <Box sx={{ p: 1, bgcolor: '#F4F8FC', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#506B88', display: 'block', fontWeight: 600, fontSize: '0.72rem' }}>
                NO₂
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '0.82rem', sm: '0.88rem' } }}>
                {info.pollutants?.no2 ?? 18} µg/m³
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Card B: Sunrise, Sunset & Solar Cycle */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
            background: '#FFFFFF',
            border: '1px solid rgba(13, 36, 64, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <WbTwilightIcon sx={{ color: '#2E5E99', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '0.98rem', sm: '1.05rem' } }}>
              {t.sunCycleTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, my: 1.2 }}>
            <Box sx={{ p: 1.5, bgcolor: '#FFF8E1', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <WbSunnyIcon sx={{ color: '#F57C00', fontSize: { xs: 26, sm: 30 } }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#795548', display: 'block', fontWeight: 600, fontSize: '0.72rem' }}>
                  {t.sunrise}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0D2440', fontSize: { xs: '0.88rem', sm: '0.98rem' } }}>
                  {info.sunrise || '06:15 AM'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 1.5, bgcolor: '#EDE7F6', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <WbTwilightIcon sx={{ color: '#512DA8', fontSize: { xs: 26, sm: 30 } }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#4527A0', display: 'block', fontWeight: 600, fontSize: '0.72rem' }}>
                  {t.sunset}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0D2440', fontSize: { xs: '0.88rem', sm: '0.98rem' } }}>
                  {info.sunset || '06:05 PM'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: '#506B88', display: 'block', textAlign: 'center', mt: 1, fontSize: '0.75rem' }}>
            {t.sunCalcNote} ({info.city})
          </Typography>
        </Card>

        {/* Card C: Wind & Aerodynamics */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
            background: '#FFFFFF',
            border: '1px solid rgba(13, 36, 64, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <NavigationIcon sx={{ color: '#2E5E99', fontSize: 20, transform: `rotate(${info.windDeg || 0}deg)` }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '0.98rem', sm: '1.05rem' } }}>
              {t.windTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2E5E99', fontSize: { xs: '2.2rem', sm: '2.8rem' } }}>
              {info.windSpeed}
            </Typography>
            <Typography variant="body2" sx={{ color: '#506B88', fontWeight: 600 }}>
              km/h ({((info.windSpeed || 0) / 3.6).toFixed(1)} m/s)
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.2, mt: 1.5 }}>
            <Box sx={{ p: 1.2, bgcolor: '#F4F8FC', borderRadius: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#506B88', display: 'block', fontSize: '0.72rem' }}>
                {t.windBearing}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0D2440', fontSize: '0.85rem' }}>
                {info.windDeg || 0}° Degree
              </Typography>
            </Box>

            <Box sx={{ p: 1.2, bgcolor: '#F4F8FC', borderRadius: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#506B88', display: 'block', fontSize: '0.72rem' }}>
                {t.airPressure}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0D2440', fontSize: '0.85rem' }}>
                {info.pressure || 1012} hPa ({t.pressureNormal})
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Card D: Moisture, Dew Point & Visibility */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
            background: '#FFFFFF',
            border: '1px solid rgba(13, 36, 64, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <DeviceThermostatIcon sx={{ color: '#2E5E99', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0D2440', fontSize: { xs: '0.98rem', sm: '1.05rem' } }}>
              {t.moistureTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0D2440', fontSize: { xs: '2.2rem', sm: '2.8rem' } }}>
              {info.humidity}%
            </Typography>
            <Typography variant="body2" sx={{ color: '#506B88', fontWeight: 600 }}>
              {t.relativeHumidity}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.2, mt: 1.5 }}>
            <Box sx={{ p: 1.2, bgcolor: '#F4F8FC', borderRadius: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#506B88', display: 'block', fontSize: '0.72rem' }}>
                {t.dewPoint}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0D2440', fontSize: '0.85rem' }}>
                {formatTemp(info.dewPoint)}°{tempUnit}
              </Typography>
            </Box>

            <Box sx={{ p: 1.2, bgcolor: '#F4F8FC', borderRadius: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#506B88', display: 'block', fontSize: '0.72rem' }}>
                {t.sightDistance}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0D2440', fontSize: '0.85rem' }}>
                {info.visibility} km ({t.sightClear})
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default InfoBox;
