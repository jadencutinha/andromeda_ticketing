// src/EventBrowser.js
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const mockEventsData = [
  {
    id: 'nft-music-fest-001', title: 'Decentralized Beats Fest', description: 'Experience the future of music with top Web3 DJs. Your NFT ticket unlocks exclusive content.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    category: 'Arts, Entertainment, & Lifestyle',
    isNFT: true, price: 0.5, currency: 'ETH', availableTickets: 50, totalTickets: 200
  },
  {
    id: 'digital-art-expo-002', title: 'CryptoArt Showcase 2024', description: 'A curated exhibition of groundbreaking digital art, tokenized as NFTs.',
    image: 'https://mlo.art/wp-content/uploads/Crypto-Art-Revolution-%E2%80%93-NFT-Showcase-in-Paris-France-by-MoCA.jpg',
    category: 'Arts, Entertainment, & Lifestyle',
    isNFT: true, price: 1.2, currency: 'MATIC', availableTickets: 20, totalTickets: 50
  },
  {
    id: 'vr-gaming-con-003', title: 'Metaverse Gaming Con', description: 'Join top VR developers and gamers. NFT pass for early access and in-game items.',
    image: 'https://game-ace.com/wp-content/uploads/2023/10/metaverse_games_image.jpg',
    category: 'Arts, Entertainment, & Lifestyle',
    isNFT: true, price: 0.8, currency: 'USDC', availableTickets: 0, totalTickets: 200 // Sold out example
  },
  {
    id: 'deficon-world-004', title: 'DeFi World Summit NFT Pass', description: 'Exclusive NFT ticket for keynotes and workshops at the leading DeFi conference.',
    image: 'https://africabriefing.com/wp-content/uploads/2023/09/Africa-Money-and-DeFi-Summit.jpg',
    category: 'Business, Tech, & Conferences',
    isNFT: true, price: 2.5, currency: 'ETH', availableTickets: 30, totalTickets: 100
  },
  {
    id: 'web3-builders-005', title: 'Web3 Innovators Pitch Night', description: 'NFT entry for an exclusive evening of Web3 startup pitches and networking.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    category: 'Business, Tech, & Conferences',
    isNFT: true, price: 1.0, currency: 'DAI', availableTickets: 75, totalTickets: 150
  },
  {
    id: 'ai-blockchain-sync-006', title: 'AI & Blockchain Synergies Forum', description: 'Explore the intersection of AI and Blockchain. NFT ticket includes access to research papers.',
    image: 'https://td-mainsite-cdn.tutorialsdojo.com/wp-content/uploads/2025/04/AI-and-Blockchain.png',
    category: 'Business, Tech, & Conferences',
    isNFT: true, price: 0.0, currency: 'FREE', availableTickets: 100, totalTickets: 250, // Free NFT example
  },
  {
    id: 'dao-community-meet-007', title: 'Local DAO Governance Meetup', description: 'Join your local DAO for a governance discussion. NFT POAP for attendees.',
    image: 'https://pixelplex.io/wp-content/uploads/2023/05/dao-governance-main-1600.jpg',
    category: 'Community & Special Interest',
    isNFT: true, price: 0.01, currency: 'ETH', availableTickets: 40, totalTickets: 50
  },
  {
    id: 'nft-collectors-hangout-008', title: 'NFT Collectors Hub', description: 'A special interest group for NFT enthusiasts to share and discuss collections. Free mint.',
    image: 'https://web3workx.com/wp-content/uploads/2023/12/NFT-Sports-Cards-8-Must-Know-Insights-for-New-Collectors.webp',
    category: 'Community & Special Interest',
    isNFT: true, price: 0, currency: 'FREE', availableTickets: 95, totalTickets: 100
  },
  {
    id: 'charity-art-auction-009', title: 'ArtForGood NFT Auction', description: 'Support a cause! All proceeds from NFT art sales go to charity. Ticketed by NFT badge.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    category: 'Community & Special Interest',
    isNFT: true, price: 0.2, currency: 'MATIC', availableTickets: 60, totalTickets: 75
  }
];

function EventBrowser({ categoryFilter }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchEvents = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
        setEvents(mockEventsData);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); 

  const filteredEvents = categoryFilter === 'All'
    ? events
    : events.filter(event => event.category === categoryFilter);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading Events...</Typography>
      </Box>
    ); 
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Discover NFT-Powered Events
      </Typography>
      {filteredEvents.length === 0 && !loading ? (
        <Typography sx={{ textAlign: 'center', mt: 5, fontStyle: 'italic' }}>
          No events found for this category. Try selecting "All Categories".
        </Typography>
      ) : (
        <Grid container spacing={4}> {}
          {filteredEvents.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default EventBrowser;