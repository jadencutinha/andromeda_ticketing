// src/TicketInteractionModal.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats, Html5QrcodeScanType } from 'html5-qrcode';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Modal, Box, Typography, IconButton, CircularProgress, Alert,
  Button, TextField, Divider, Tabs, Tab, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 550,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, md: 3 },
};

const scannerRegionId = "ticket-scanner-region-unmount";

const verifyTicketOnChain = async (ticketId) => {
    console.log(`Simulating on-chain verification for: ${ticketId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const validEventSpecificId = "EVENT001-SEAT101-USERXYZ";
    if (ticketId === 'NFTix-VALID-12345' || ticketId === validEventSpecificId || ticketId.startsWith("VALID:")) {
        return { success: true, message: `Ticket ID: ${ticketId} is VALID.`, details: { eventName: "Decentralized Beats Fest", seat: "VIP A1", holder: "0x123..." } };
    } else if (ticketId === 'NFTix-USED-67890' || ticketId.startsWith("USED:")) {
        return { success: false, message: `Ticket ID: ${ticketId} is ALREADY USED.`, details: null };
    }
    return { success: false, message: `Ticket ID: ${ticketId} is INVALID or NOT FOUND.`, details: null };
};

const TicketInteractionModal = ({ open, onClose }) => {
  const html5QrCodeScannerInstanceRef = useRef(null);

  const [cameraError, setCameraError] = useState(null);
  const [showScannerComponent, setShowScannerComponent] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [ticketToGenerate, setTicketToGenerate] = useState('VALID:NFTix-VALID-12345');
  const [scannedOrSimulatedId, setScannedOrSimulatedId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const stopScannerCleanup = useCallback(async () => {
    if (html5QrCodeScannerInstanceRef.current) {
      const scanner = html5QrCodeScannerInstanceRef.current;
      html5QrCodeScannerInstanceRef.current = null; // Nullify ref BEFORE async operations
      try {
        if (scanner.getState && typeof scanner.getState === 'function') {
            const scannerState = scanner.getState();
            if (scannerState === 2 || scannerState === 1) {
                 await scanner.stop(); 
                 console.log("Scanner stopped via instance.stop()");
            } else if (scannerState === 0 || scannerState === 3) {
                console.log("Scanner already stopped or in a non-scannable state, attempting clear if needed.");
            } else {
                 await scanner.clear(); 
                 console.log("Scanner cleared via instance.clear()");
            }
        } else {
            await scanner.clear();
            console.log("Scanner cleared (getState not available).");
        }
      } catch (error) {
        console.warn("Error during scanner stop/clear:", error);
      }
    }
  }, []);

  const onScanSuccessCallback = useCallback(async (decodedText, decodedResult) => {
    setShowScannerComponent(false); 
    setScannedOrSimulatedId(decodedText);
    setIsVerifying(true);
    setVerificationResult(null);
    try { const result = await verifyTicketOnChain(decodedText); setVerificationResult(result); }
    catch (e) { setVerificationResult({ success: false, message: "Verification error: " + e.message, details: null }); }
    finally { setIsVerifying(false); }
  }, []);

  useEffect(() => {
    if (showScannerComponent && activeTab === 0 && !html5QrCodeScannerInstanceRef.current) {
      const scannerRegionDiv = document.getElementById(scannerRegionId);
      if (!scannerRegionDiv) {
        setCameraError("Scanner DOM element not found on mount. Please try again.");
        setShowScannerComponent(false);
        return;
      }
      setCameraError(null);

      try {
        const config = { fps: 10, qrbox: { width: 200, height: 200 }, rememberLastUsedCamera: true, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], disableFlip: true };
        const scanner = new Html5QrcodeScanner(scannerRegionId, config, false);
        scanner.render(onScanSuccessCallback, (errorMessage) => {
          if (!cameraError) {
            if (errorMessage.toLowerCase().includes("permission") || errorMessage.toLowerCase().includes("notallowederror")) {
              setCameraError("Camera permission denied."); setShowScannerComponent(false);
            } else if (errorMessage.toLowerCase().includes("notfounderror")) {
              setCameraError("No camera found."); setShowScannerComponent(false);
            }
          }
        });
        html5QrCodeScannerInstanceRef.current = scanner;
      } catch (error) {
        console.error("Error initializing QR Scanner:", error);
        setCameraError(`Init error: ${error.message || "Unknown"}.`);
        setShowScannerComponent(false);
      }
    }
  }, [showScannerComponent, activeTab, onScanSuccessCallback, cameraError]); // Added cameraError

  useEffect(() => {
    if (!showScannerComponent && html5QrCodeScannerInstanceRef.current) {
      stopScannerCleanup();
    }
    return () => {
      if (html5QrCodeScannerInstanceRef.current) {
        stopScannerCleanup();
      }
    };
  }, [showScannerComponent, stopScannerCleanup]);

  const setInternalStatesToDefault = useCallback((resetActiveTab = false) => {
    setVerificationResult(null);
    setScannedOrSimulatedId('');
    setCameraError(null);
    setIsVerifying(false);
    setShowScannerComponent(false);
    if (resetActiveTab) setActiveTab(0);
  }, []);

  const handleModalClose = useCallback(() => {
    setInternalStatesToDefault(true); 
    onClose();
  }, [onClose, setInternalStatesToDefault]);

  const handleTabChange = useCallback(async (event, newValue) => {
    if (html5QrCodeScannerInstanceRef.current || showScannerComponent) {
      setShowScannerComponent(false); 
    }
    setInternalStatesToDefault(false); 
    setActiveTab(newValue);
  }, [setInternalStatesToDefault]);

  const handleManualStartScanner = () => {
    setInternalStatesToDefault(false); 
    setShowScannerComponent(true); 
  };

  const handleScanAnother = async () => {
    setInternalStatesToDefault(false); 
  };

  const handleSimulateScan = async () => {
    if (!ticketToGenerate) { alert("Please enter a Ticket ID to simulate."); return; }
    if (showScannerComponent) setShowScannerComponent(false); 

    setScannedOrSimulatedId(ticketToGenerate);
    setIsVerifying(true);
    setVerificationResult(null);
    try { const result = await verifyTicketOnChain(ticketToGenerate); setVerificationResult(result); }
    catch (e) { setVerificationResult({ success: false, message: "Verification error: " + e.message, details: null }); }
    finally { setIsVerifying(false); }
  };

  const renderVerificationResult = () => {
    if (isVerifying) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2, p: 2 }}>
          <CircularProgress />
          <Typography sx={{ mt: 1 }}>Verifying: {scannedOrSimulatedId || "..."}</Typography>
        </Box>
      );
    }
    if (!verificationResult) return null;
    return (
      <Paper elevation={2} sx={{ p: {xs: 1, md:2}, mt: 2, textAlign: 'center', borderColor: verificationResult.success ? 'success.main' : 'error.main', borderWidth: 2, borderStyle: 'solid', borderRadius: 2 }}>
        {verificationResult.success ? (
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: {xs: 30, md: 40}, mb: 1 }} />
        ) : (
          <HighlightOffIcon color="error" sx={{ fontSize: {xs: 30, md: 40}, mb: 1 }} />
        )}
        <Typography variant="h6" component="div" color={verificationResult.success ? 'success.main' : 'error.main'}>
          {verificationResult.success ? "Access Granted" : "Access Denied"}
        </Typography>
        <Typography variant="body1" sx={{mb:1, wordBreak: 'break-word'}}>{verificationResult.message}</Typography>
        {verificationResult.details && (
          <Box sx={{ mt: 1, textAlign: 'left', fontSize: '0.9rem', p:1, borderRadius:1, background: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' }}>
            <Typography variant="subtitle2" component="div" sx={{fontWeight:'bold'}}>Details:</Typography>
            <Typography component="div">Event: {verificationResult.details.eventName}</Typography>
            <Typography component="div">Seat: {verificationResult.details.seat}</Typography>
            <Typography component="div">Holder Hint: {verificationResult.details.holder}</Typography>
          </Box>
        )}
         <Button onClick={handleScanAnother} sx={{mt:2}} variant="outlined" size="small">
            Scan/Verify Another
        </Button>
      </Paper>
    );
  };

  return (
    <Modal open={open} onClose={handleModalClose} aria-labelledby="ticket-interaction-modal-title">
      <Box sx={modalStyle}>
        <IconButton aria-label="close" onClick={handleModalClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex:1 }}> <CloseIcon /> </IconButton>
        <Typography id="ticket-interaction-modal-title" variant="h5" component="h2" sx={{ mb: 1, textAlign: 'center' }}> Ticket Interaction </Typography>
        <Tabs value={activeTab} onChange={handleTabChange} centered variant="fullWidth" sx={{borderBottom: 1, borderColor: 'divider', mb:2}}>
          <Tab icon={<CameraAltIcon />} label="Scan Ticket" />
          <Tab icon={<QrCodeIcon />} label="Generate/Simulate" />
        </Tabs>

        <Box sx={{ p: {xs: 0, md: 1}, mt: 1 }}>
            {activeTab === 0 && ( 
              <Box>
                {verificationResult || isVerifying ? (
                  renderVerificationResult()
                ) : (
                  <>
                    {cameraError && <Alert severity="error" sx={{ width: '100%', mb: 1 }}>{cameraError}</Alert>}
                    
                    {showScannerComponent ? (
                        <Box
                            id={scannerRegionId} // The library will inject its UI here
                            sx={{
                                width: '100%', maxWidth: '300px', height: '250px',
                                margin: '10px auto', border: '1px solid #ddd',
                                borderRadius: 1, overflow: 'hidden', bgcolor: '#f0f0f0',
                            }}
                        >
                            {}
                            {/* Show a spinner if scanner component is shown but instance not yet ready */}
                            {!html5QrCodeScannerInstanceRef.current && !cameraError && <CircularProgress sx={{display: 'block', margin: 'auto', mt: '100px'}} />}
                        </Box>
                    ) : (
                        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', mt: 2, p: 2, border: '1px dashed #ccc', borderRadius:1, bgcolor: 'action.hover'}}>
                           <CameraAltIcon sx={{fontSize: 50, color: 'text.disabled', mb:1}}/>
                           <Typography color="text.secondary" sx={{mb:1}}>
                             {cameraError || "Camera is off. Click Start to scan."}
                           </Typography>
                           <Button onClick={handleManualStartScanner} variant="outlined" size="small">Start Camera</Button>
                       </Box>
                    )}

                    {showScannerComponent && html5QrCodeScannerInstanceRef.current && !cameraError && (
                        <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                        Point camera at QR code.
                        </Typography>
                    )}
                  </>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pt: 1 }}>
                <Typography variant="h6" gutterBottom>Generate QR Code</Typography>
                <TextField label="Ticket ID for QR" value={ticketToGenerate} onChange={(e) => setTicketToGenerate(e.target.value)} fullWidth sx={{ maxWidth: 400 }} />
                {ticketToGenerate && (<Paper elevation={1} sx={{ p: 2, display: 'inline-block', mt:1, background: '#fff' }}><QRCodeCanvas value={ticketToGenerate} size={200} level="H" bgColor="#FFFFFF" fgColor="#000000" /></Paper>)}
                <Divider sx={{width: '80%', my: 2}} />
                <Typography variant="h6" gutterBottom>Simulate Verification</Typography>
                <Button onClick={handleSimulateScan} variant="contained" color="secondary" size="large" disabled={isVerifying || !ticketToGenerate}>Verify ID</Button>
                {renderVerificationResult()}
              </Box>
            )}
        </Box>
      </Box>
    </Modal>
  );
};

export default TicketInteractionModal;