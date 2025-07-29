// src/SeatMap.js
import React from 'react';
import { Box, Grid, Button, Typography, Chip } from '@mui/material';

const seatColors = {
  regular: { available: 'primary', selected: 'secondary', taken: 'action.disabled' },
  premium: { available: 'success', selected: 'warning', taken: 'action.disabled' },
  limited: { available: 'info', selected: 'error', taken: 'action.disabled' },
};

function Seat({ seat, onSelect, isSelected }) {
  const tier = seat.tier || 'regular';
  const colors = seatColors[tier];
  
  return (
    <Button
      variant={isSelected ? "contained" : "outlined"}
      color={colors.available}
      disabled={!seat.available}
      onClick={() => onSelect(seat)}
      sx={{
        minWidth: '35px',
        height: '35px',
        m: 0.5,
        p: 0,
        fontWeight: isSelected ? 'bold' : 'normal',
        borderColor: !seat.available ? 'transparent' : `${colors.available}.main`,
        bgcolor: !seat.available ? colors.taken : (isSelected ? `${colors.selected}.main` : 'transparent'),
        color: !seat.available ? 'text.secondary' : (isSelected ? 'common.white' : `${colors.available}.main`),
        '&:hover': {
          bgcolor: isSelected ? `${colors.selected}.dark` : `${colors.available}.light`,
          color: isSelected ? 'common.white' : `${colors.available}.dark`,
        }
      }}
    >
      {seat.id.split('-')[1]}
    </Button>
  );
}

function SeatMap({ section, selectedSeats, onSeatSelect }) {
  if (!section || !section.seats) {
    return (
      <Typography sx={{ mt: 2, fontStyle: 'italic', textAlign: 'center' }}>
        Select a section to view available seats.
      </Typography>
    );
  }

  const rows = section.seats.reduce((acc, seat) => {
    const rowId = seat.id.split('-')[0];
    if (!acc[rowId]) {
      acc[rowId] = [];
    }
    acc[rowId].push(seat);
    return acc;
  }, {});

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Select Your Seats for "{section.name}"
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, my: 2 }}>
        <Chip label="Available" variant="outlined" color="primary" size="small" />
        <Chip label="Premium" variant="outlined" color="success" size="small" />
        <Chip label="Limited" variant="outlined" color="info" size="small" />
        <Chip label="Selected" variant="filled" color="secondary" size="small" />
        <Chip label="Taken" variant="filled" disabled size="small" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {Object.entries(rows).map(([rowId, seatsInRow]) => (
          <Grid container key={rowId} justifyContent="center" alignItems="center">
            <Typography sx={{ mr: 1, width: '20px' }}>{rowId}</Typography>
            {seatsInRow.map((seat) => (
              <Seat
                key={seat.id}
                seat={seat}
                onSelect={onSeatSelect}
                isSelected={selectedSeats.some(s => s.id === seat.id)}
              />
            ))}
          </Grid>
        ))}
      </Box>
    </Box>
  );
}

export default SeatMap;