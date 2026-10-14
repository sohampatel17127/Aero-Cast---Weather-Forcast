import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Chip,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ClickAwayListener,
  CircularProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { fetchCitySuggestions } from '../services/weatherService';
import { TRANSLATIONS } from '../utils/translations';

/**
 * Module 2: SearchBox Component
 * 
 * Features:
 * - Controlled input using Material UI TextField
 * - Form submission lifecycle intercepted with event.preventDefault()
 * - Real-time validation: prevents empty/whitespace submission, helper text if length < 2
 * - Live suggestions dropdown & quick-pick city buttons
 * - Geolocation GPS button for 1-click current location
 * - Bilingual support (English & Hindi)
 */
export const SearchBox = ({ updateInfo, isLoading = false, lang = 'en' }) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const debounceTimerRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Popular quick-pick cities
  const PRESET_CITIES = [
    'New Delhi', 'Mumbai', 'Surat', 'Ahmedabad', 'Bengaluru',
    'London', 'New York', 'Tokyo', 'Dubai', 'Paris'
  ];

  // Debounced autocomplete suggestions from OpenWeather Geocoding
  useEffect(() => {
    const trimmed = city.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await fetchCitySuggestions(trimmed);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [city]);

  const handleChange = (e) => {
    const val = e.target.value;
    setCity(val);

    if (error) {
      setError(false);
      setHelperText('');
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setShowDropdown(false);

    const trimmed = city.trim();

    // Hands-on validation: prevent whitespace and short input
    if (!trimmed) {
      setError(true);
      setHelperText(t.emptyError);
      return;
    }

    if (trimmed.length < 2) {
      setError(true);
      setHelperText(t.shortError);
      return;
    }

    setError(false);
    setHelperText('');
    updateInfo(trimmed);
  };

  const handleSelectSuggestion = (item) => {
    setCity(item.name);
    setShowDropdown(false);
    setError(false);
    setHelperText('');
    if (item.lat != null && item.lon != null) {
      updateInfo({ lat: item.lat, lon: item.lon, name: item.name });
    } else {
      updateInfo(item.name);
    }
  };

  const handleClear = () => {
    setCity('');
    setSuggestions([]);
    setShowDropdown(false);
    setError(false);
    setHelperText('');
  };

  const handleChipClick = (cityName) => {
    setCity(cityName);
    setShowDropdown(false);
    setError(false);
    setHelperText('');
    updateInfo(cityName);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError(true);
      setHelperText('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(false);
    setHelperText('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        updateInfo({ lat: latitude, lon: longitude, name: 'Current Location' });
      },
      (_err) => {
        setIsLocating(false);
        setError(true);
        setHelperText(t.geoError);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 740, mx: 'auto', mb: 3 }}>
      <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
        <Box sx={{ position: 'relative' }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              label={t.searchLabel}
              placeholder={t.searchPlaceholder}
              variant="outlined"
              value={city}
              onChange={handleChange}
              error={error}
              helperText={helperText}
              disabled={isLoading || isLocating}
              autoComplete="off"
              slotProps={{
                input: {
                  startAdornment: <LocationOnIcon sx={{ color: '#2E5E99', mr: 1 }} />,
                  endAdornment: (
                    <>
                      {city && (
                        <IconButton onClick={handleClear} size="small" sx={{ mr: 0.5 }}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )}
                      <Tooltip title={t.currentLocation} arrow>
                        <IconButton
                          onClick={handleUseMyLocation}
                          disabled={isLoading || isLocating}
                          size="small"
                          sx={{ color: '#2E5E99' }}
                        >
                          {isLocating ? <CircularProgress size={18} /> : <MyLocationIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </>
                  ),
                },
              }}
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || isLocating}
              sx={{
                height: 56,
                minWidth: { xs: 52, sm: 110 },
                px: { xs: 1.5, sm: 3 },
                borderRadius: '8px',
                bgcolor: '#2E5E99',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(46, 94, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                '&:hover': {
                  bgcolor: '#1B4272',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
              ) : (
                <>
                  <SearchIcon sx={{ fontSize: { xs: 22, sm: 20 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {t.searchButton}
                  </Box>
                </>
              )}
            </Button>
          </Box>

          {/* Autocomplete Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <Paper
              elevation={6}
              sx={{
                position: 'absolute',
                top: 'calc(100% - 18px)',
                left: 0,
                right: { xs: 0, sm: 120 },
                zIndex: 1300,
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(46, 94, 153, 0.2)',
              }}
            >
              <List sx={{ p: 0.5 }}>
                {suggestions.map((item, idx) => (
                  <ListItemButton
                    key={`${item.name}-${item.lat}-${idx}`}
                    onClick={() => handleSelectSuggestion(item)}
                    sx={{
                      borderRadius: '6px',
                      py: 0.8,
                      '&:hover': { bgcolor: '#E7F0FA' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: '#2E5E99' }}>
                      <LocationOnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</Typography>}
                      secondary={
                        <Typography variant="caption" sx={{ color: '#506B88' }}>
                          {item.state ? `${item.state}, ` : ''}{item.country}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </ClickAwayListener>

      {/* Quick-Pick Popular City Chips - Native Horizontal Carousel on Mobile */}
      <Box sx={{ mt: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.6, px: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: '#506B88',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <span>⚡</span> {t.quickPicks}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#7BA4D0',
              fontSize: '0.68rem',
              fontWeight: 600,
              display: { xs: 'block', sm: 'none' },
            }}
          >
            {lang === 'hi' ? 'स्क्रॉल करें ›' : 'Scroll ›'}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            overflowX: 'auto',
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            pb: 0.8,
            pt: 0.2,
            px: 0.5,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {PRESET_CITIES.map((name) => (
            <Chip
              key={name}
              label={name}
              size="small"
              clickable
              onClick={() => handleChipClick(name)}
              disabled={isLoading}
              sx={{
                fontWeight: 600,
                fontSize: '0.78rem',
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(46, 94, 153, 0.2)',
                color: '#0D2440',
                borderRadius: '99px',
                flexShrink: 0,
                boxShadow: '0 1px 3px rgba(13, 36, 64, 0.04)',
                transition: 'all 0.15s ease',
                '&:hover': { bgcolor: '#E7F0FA', borderColor: '#2E5E99' },
                '&:active': { transform: 'scale(0.96)' },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchBox;
