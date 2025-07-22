// src/TicketPurchasePage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, IconButton, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SeatMap from './SeatMap';

// Assuming you have this file set up from previous steps
import { mintNftTicket } from './cosmjs'; 
const ANDROMEDA_CHAIN_ID = "andromeda-1"; 

// --- UPDATED MOCK DATA LOGIC ---
const generateMockSeats = (rows, seatsPerRow, availability) => {
  let seats = [];
  for (let r = 0; r < rows; r++) {
    const rowChar = String.fromCharCode(65 + r); // A, B, C...
    for (let s = 1; s <= seatsPerRow; s++) {
      let tier = 'regular';
      if (r < 2) tier = 'premium';
      if (s <= 2 || s > seatsPerRow - 2) tier = 'limited'; 
      seats.push({
        id: `${rowChar}-${s}`,
        available: Math.random() < availability,
        tier: tier,
      });
    }
  }
  return seats;
};

const getMockSeatData = (eventId) => ({
  sections: [
    { id: 'ga', name: 'General Admission', price: 10, currency: "ANDR", available: 100 },
    { id: 'sec-101', name: 'Section 101', price: 25, currency: "ANDR", seats: generateMockSeats(8, 12, 0.7) },
    { id: 'sec-102', name: 'Section 102', price: 25, currency: "ANDR", seats: generateMockSeats(8, 12, 0.5) },
  ],
});
// --- END OF MOCK DATA LOGIC ---


function TicketPurchasePage({ walletConnected }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [seatData, setSeatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState('');
  const [mintSuccess, setMintSuccess] = useState(''); // Can now hold JSX
  const [mintedTxHash, setMintedTxHash] = useState('');
  const [connectedWalletAddress, setConnectedWalletAddress] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
        setEvent({ id: eventId, title: `Event ${eventId}`});
        setSeatData(getMockSeatData(eventId));
        setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [eventId]);

  useEffect(() => {
    const getAddress = async () => {
      if (walletConnected && window.keplr) {
        try {
          const offlineSigner = window.keplr.getOfflineSigner(ANDROMEDA_CHAIN_ID);
          const accounts = await offlineSigner.getAccounts();
          if (accounts.length > 0) setConnectedWalletAddress(accounts[0].address);
        } catch (e) { console.error("Could not get Keplr address:", e); }
      } else {
        setConnectedWalletAddress('');
      }
    };
    getAddress();
  }, [walletConnected]);

  const handleSectionChange = (e) => {
    setSelectedSectionId(e.target.value);
    setSelectedSeats([]);
  };

  const handleSeatSelect = (seat) => {
    setSelectedSeats(prev => {
      const isAlreadySelected = prev.some(s => s.id === seat.id);
      if (isAlreadySelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const selectedSectionDetails = useMemo(() => {
    return seatData?.sections.find(s => s.id === selectedSectionId);
  }, [seatData, selectedSectionId]);

  const totalPrice = useMemo(() => {
    if (!selectedSectionDetails) return 0;
    if (selectedSectionDetails.id === 'ga') return selectedSectionDetails.price;
    return selectedSeats.length * selectedSectionDetails.price;
  }, [selectedSeats, selectedSectionDetails]);

  // --- UPDATED AND FINALIZED FUNCTION ---
  const handleProceedToPayment = async () => {
    if (!walletConnected || !connectedWalletAddress) {
      alert("Please connect your Keplr wallet to proceed.");
      return;
    }
    const isGA = selectedSectionDetails?.id === 'ga';
    if (!selectedSectionId || (!isGA && selectedSeats.length === 0)) {
      alert("Please select a section and your seats.");
      return;
    }

    setIsMinting(true);
    setMintError('');
    setMintSuccess('');
    setMintedTxHash('');

    console.log("Simulating minting process...");

    // This is our MOCK MINTING function. It simulates the delay and potential failure of a real transaction.
    // Replace this with the real `mintNftTicket` call when your RPC/contract is ready.
    const simulateMint = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a random success or failure
        if (Math.random() > 0.2) { // 80% chance of success
          // On success, resolve with a fake transaction receipt object
          resolve({
            transactionHash: `ANDR_FAKE_TX_${Date.now().toString(16).toUpperCase()}${Math.random().toString(16).slice(2).toUpperCase()}`,
          });
        } else {
          // On failure, reject with a realistic error message
          reject(new Error("Simulation Failed: Transaction was rejected or there were insufficient funds."));
        }
      }, 2500); // Simulate a 2.5 second network delay
    });

    try {
      // To use your real function, comment out `simulateMint` and uncomment this:
      // const placeholderMetadataUrl = `https://your-metadata-server.com/api/ticket/${event.id}/metadata.json`;
      // const result = await mintNftTicket(connectedWalletAddress, event.id, placeholderMetadataUrl);
      
      const result = await simulateMint; // Using the simulation for now

      const ticketsMinted = isGA ? '1 General Admission Ticket' : `Seat(s): ${selectedSeats.map(s => s.id).join(', ')}`;
      
      // Create a detailed success message as a JSX element
      const successMessage = (
        <>
          <Typography component="div" variant="body2" sx={{fontWeight: 'bold'}}>Mint Successful!</Typography>
          <Typography component="div" variant="caption">Your ticket has been minted: {ticketsMinted}</Typography>
        </>
      );

      setMintSuccess(successMessage);
      setMintedTxHash(result.transactionHash);

      // TODO: Update UI to show seats as taken. For now, the success message is feedback.

    } catch (err) {
      setMintError(err.message || "An unknown error occurred during minting.");
    } finally {
      setIsMinting(false);
    }
  };
  // --- END OF UPDATED FUNCTION ---

  if (loading) return <CircularProgress sx={{display: 'block', margin: '100px auto'}} />;
  if (!event) return <Alert severity="error">Event details could not be loaded.</Alert>;

  const canProceed = walletConnected && selectedSectionId && (selectedSectionId === 'ga' || selectedSeats.length > 0);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mt: 2, mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}> <ArrowBackIcon /> </IconButton>
        <Typography variant="h4" component="h1" gutterBottom>Buy Tickets for: {event.title}</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>1. Select Section/Tier</Typography>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="section-select-label">Section/Tier</InputLabel>
              <Select labelId="section-select-label" value={selectedSectionId} label="Section/Tier" onChange={handleSectionChange}>
                {seatData?.sections?.map((section) => (
                  <MenuItem key={section.id} value={section.id}>{section.name} - {section.price} {section.currency}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedSectionDetails && selectedSectionDetails.id !== 'ga' && (
              <>
                <Typography variant="h6" gutterBottom sx={{mt: 2}}>2. Select Seats</Typography>
                <SeatMap
                  section={selectedSectionDetails}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                />
              </>
            )}
            {selectedSectionDetails && selectedSectionDetails.id === 'ga' && (
                <Alert severity="info" sx={{mt: 2}}>General Admission ticket selected (1 per transaction). Proceed to payment.</Alert>
            )}
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography><b>Event:</b> {event.title}</Typography>
              <Typography><b>Section:</b> {selectedSectionDetails?.name || 'N/A'}</Typography>
              <Typography><b>Tickets:</b> {selectedSectionDetails?.id === 'ga' ? 1 : selectedSeats.length}</Typography>
              {selectedSeats.length > 0 && (
                <Typography variant="body2"><b>Seats:</b> {selectedSeats.map(s => s.id).join(', ')}</Typography>
              )}
              <Divider sx={{my: 1}} />
              <Typography variant="h6"><b>Total:</b> {totalPrice.toFixed(2)} {selectedSectionDetails?.currency || ''}</Typography>
            </Paper>
            
            {/* Minting feedback section */}
            <Box sx={{mt: 2, minHeight: '90px'}}>
                {mintError && <Alert severity="error">{mintError}</Alert>}
                {mintSuccess && <Alert severity="success">{mintSuccess}</Alert>}
                {mintedTxHash && (
                    <Button fullWidth size="small" sx={{mt:1}} href={`https://www.mintscan.io/andromeda/txs/${mintedTxHash}`} target="_blank" rel="noopener noreferrer">View Transaction</Button>
                )}
            </Box>

            <Button fullWidth variant="contained" size="large" sx={{ mt: 1 }} onClick={handleProceedToPayment} disabled={!canProceed || isMinting}>
              {isMinting ? <CircularProgress size={24} color="inherit" /> : (walletConnected ? "Mint Ticket(s)" : "Connect Wallet to Mint")}
            </Button>
            {!walletConnected && <Typography variant="caption" color="error" display="block" sx={{mt:1, textAlign:'center'}}>Wallet not connected.</Typography>}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
export default TicketPurchasePage;