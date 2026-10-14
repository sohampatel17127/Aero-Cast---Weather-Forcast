import React from 'react';
import { Box } from '@mui/material';
import logoImg from '../assets/logo.png';

/**
 * WeatherLogo Component
 * Renders the authentic logo uploaded by the user
 */
export const WeatherLogo = ({ size = 44 }) => {
  return (
    <Box
      component="img"
      src={logoImg}
      alt="Weather App Logo"
      sx={{
        width: size,
        height: size,
        objectFit: 'contain',
        borderRadius: '10px',
        display: 'block',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    />
  );
};

export default WeatherLogo;
