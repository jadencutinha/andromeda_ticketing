import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react'; // Use QRCodeCanvas for rendering

function TicketScanner() {
  const [scannedTicketId, setScannedTicketId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [ticketToGenerate, setTicketToGenerate] = useState('NFTix-12345'); // Default QR code content

  const handleScan = () => {
    // Simulate scanning a QR code
    // In a real application, this would involve a camera feed and a QR code scanning library
    // For now, we'll simulate a successful scan with a predefined ID or the generated one.
    const simulatedScannedId = ticketToGenerate; // Or a random valid/invalid one for testing
    setScannedTicketId(simulatedScannedId);

    // Simulate verification logic
    // In a real dApp, this would involve calling a smart contract to verify the NFT ticket
    if (simulatedScannedId === 'NFTix-12345' || simulatedScannedId === 'NFTix-67890') { // Example valid IDs
      setVerificationResult({ success: true, message: `Ticket ${simulatedScannedId} is valid. Access Granted!` });
    } else {
      setVerificationResult({ success: false, message: `Ticket ${simulatedScannedId} is invalid. Access Denied.` });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Ticket Verification
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Scan NFT tickets to verify their validity for event access.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Generate QR Code for Testing
        </Typography>
        <TextField
          label="Ticket ID for QR Code"
          variant="outlined"
          value={ticketToGenerate}
          onChange={(e) => setTicketToGenerate(e.target.value)}
          fullWidth
          sx={{ maxWidth: 300 }}
        />
        {ticketToGenerate && (
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, display: 'inline-block' }}>
            <QRCodeCanvas value={ticketToGenerate} size={256} level="H" />
          </Box>
        )}
        <Typography variant="caption" color="text.secondary">
          (This QR code can be scanned by the simulated scanner below)
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" gutterBottom>
          Simulate Ticket Scan
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleScan}
          sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
        >
          Simulate Scan QR Code
        </Button>

        {scannedTicketId && (
          <Box sx={{ mt: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, width: '100%' }}>
            <Typography variant="body1">
              <strong>Scanned Ticket ID:</strong> {scannedTicketId}
            </Typography>
            {verificationResult && (
              <Typography variant="body1" color={verificationResult.success ? 'success.main' : 'error.main'}>
                <strong>Verification Result:</strong> {verificationResult.message}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default TicketScanner;