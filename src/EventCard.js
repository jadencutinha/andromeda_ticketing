// src/EventCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';

function EventCard({ event }) {
  const navigate = useNavigate(); 

  const {
    id, 
    title,
    description,
    image,
    category,
    price,
    currency,
    availableTickets,
    totalTickets,
    isNFT,
  } = event;

  const handleBuyTicket = () => {
    if (event.id) {
      navigate(`/event/${event.id}/purchase`); 
    } else {
      console.error("Event ID is missing, cannot navigate to purchase page.");
      alert("Error: Event details are incomplete.");
    }
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3, '&:hover': { boxShadow: 7, transform: 'translateY(-2px)' }, transition: 'all 0.2s ease-in-out' }}>
      <CardMedia
        component="img"
        height="200"
        image={image || 'https://via.placeholder.com/345x200?text=Event+Image'}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: '40px' }}>
          {description}
        </Typography>
        <Chip label={category} size="small" color="secondary" variant="outlined" sx={{ mb: 1 }} />

        {isNFT && (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <ConfirmationNumberIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
            <Typography variant="caption" color="primary.main" fontWeight="medium">
              NFT Ticketed Event
            </Typography>
          </Box>
        )}

        {price !== undefined && currency && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
            <Typography variant="subtitle1" fontWeight="bold" color="success.main">
              {price === 0 ? 'Free' : `${price} ${currency}`}
            </Typography>
          </Box>
        )}

        {totalTickets !== undefined && (
           <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EventSeatIcon fontSize="small" sx={{ mr: 0.5, color: 'info.main' }} />
            <Typography variant="caption" display="block" color="text.secondary">
              {availableTickets !== undefined ? `Tickets: ${availableTickets} / ${totalTickets}` : `Total Supply: ${totalTickets}`}
              {availableTickets === 0 && " (Sold Out)"}
            </Typography>
           </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', p: 2, borderTop: '1px solid #eee' }}>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={handleBuyTicket} 
          disabled={availableTickets === 0 || !isNFT}
          fullWidth
        >
          {availableTickets === 0 ? "Sold Out" : (isNFT ? "Buy NFT Ticket" : "Get Ticket")}
        </Button>
      </CardActions>
    </Card>
  );
}

export default EventCard;