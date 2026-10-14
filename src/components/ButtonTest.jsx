import React from 'react';
import { Button, Typography, Stack, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { TRANSLATIONS } from '../utils/translations';

/**
 * Module 1 Hands-on Student Exercise Component
 * 
 * Requirements:
 * 1. A red "Delete" button with a Trash (Delete) icon.
 * 2. A green "Submit" button with a Send icon.
 * 3. An outlined disabled button.
 */
export const ButtonTest = ({ lang = 'en' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        my: 2,
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0D2440' }}>
        {t.module1Title}
      </Typography>
      
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="center">
        {/* 1. Red Delete button with Trash icon */}
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={{
            bgcolor: '#d32f2f',
            color: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#b71c1c' },
          }}
        >
          {t.btnDelete}
        </Button>

        {/* 2. Green Submit button with Send icon */}
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          sx={{
            bgcolor: '#2e7d32',
            color: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#1b5e20' },
          }}
        >
          {t.btnSubmit}
        </Button>

        {/* 3. Outlined disabled button */}
        <Button variant="outlined" disabled sx={{ textTransform: 'none', fontWeight: 600 }}>
          {t.btnDisabled}
        </Button>
      </Stack>
    </Paper>
  );
};

export default ButtonTest;
