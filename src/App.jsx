import React, { useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import WeatherApp from './components/WeatherApp';

/**
 * App Root
 * 
 * AeroCast — Atmospheric Weather Telemetry Portal
 * Inspired by the authentic, clean e-Samanvit Government Portal design:
 * - Clean white navbar & card surfaces (#FFFFFF)
 * - Corporate Azure Blue (#2E5E99) & Slate Steel (#7BA4D0)
 * - Deep Midnight Navy (#0D2440) for high-contrast authoritative headings
 * - Soft Ice ground background (#F4F8FC)
 * - ZERO artificial grid lines, zero sci-fi neon boxes.
 */
function App() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#2E5E99',
            light: '#4B7AB8',
            dark: '#1B4272',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#7BA4D0',
            light: '#E7F0FA',
            dark: '#2E5E99',
            contrastText: '#0D2440',
          },
          info: {
            main: '#2E5E99',
            light: '#E7F0FA',
            dark: '#0D2440',
            contrastText: '#FFFFFF',
          },
          background: {
            default: '#F4F8FC',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#0D2440',
            secondary: '#506B88',
          },
          divider: 'rgba(13, 36, 64, 0.08)',
        },
        typography: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          h1: { fontFamily: '"Outfit", "Inter", sans-serif', color: '#0D2440' },
          h2: { fontFamily: '"Outfit", "Inter", sans-serif', color: '#0D2440' },
          h3: { fontFamily: '"Outfit", "Inter", sans-serif', color: '#0D2440' },
          h4: { fontFamily: '"Outfit", "Inter", sans-serif', color: '#0D2440' },
          h5: { fontFamily: '"Outfit", "Inter", sans-serif', color: '#0D2440' },
          h6: { fontFamily: '"Outfit", "Inter", sans-serif', color: '#0D2440' },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 600,
                textTransform: 'none',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 99,
              },
            },
          },
        },
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WeatherApp />
    </ThemeProvider>
  );
}

export default App;
