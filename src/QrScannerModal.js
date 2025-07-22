// src/QrScannerModal.js
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Modal, Box, Typography, IconButton, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const QrScannerModal = ({ open, onClose, onScanSuccess, onScanError }) => {
  const scannerRegionId = "html5qr-code-full-region";
  const html5QrCodeScannerRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (open && !html5QrCodeScannerRef.current) {
      try {
        setIsScanning(true);
        setCameraError(null);
        const scanner = new Html5QrcodeScanner(
          scannerRegionId,
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.7); // Make QR box 70% of the smaller dimension
              return {
                width: qrboxSize,
                height: qrboxSize,
              };
            },
            rememberLastUsedCamera: true,
            supportedScanTypes: [0], // 0 for SCAN_TYPE_CAMERA
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
          },
          /* verbose= */ false
        );

        const successCallback = (decodedText, decodedResult) => {
          if (html5QrCodeScannerRef.current) {
            html5QrCodeScannerRef.current.clear(); // Clear scanner on success
            html5QrCodeScannerRef.current = null; // Reset ref
          }
          onScanSuccess(decodedText, decodedResult);
          setIsScanning(false);
          onClose(); // Close modal on success
        };

        const errorCallback = (errorMessage) => {
          // console.warn(`QR Code scan error: ${errorMessage}`);
          // onScanError can be called here if needed for continuous error reporting
          // For simplicity, we'll let it keep trying or handle major errors
        };

        scanner.render(successCallback, errorCallback);
        html5QrCodeScannerRef.current = scanner;

      } catch (error) {
        console.error("Error initializing QR Scanner:", error);
        setCameraError("Could not initialize camera or QR scanner. Please ensure camera permissions are granted and try again.");
        setIsScanning(false);
      }
    }

    // Cleanup function
    return () => {
      if (html5QrCodeScannerRef.current) {
        try {
          html5QrCodeScannerRef.current.clear();
        } catch (clearError) {
          console.error("Error clearing QR Scanner:", clearError);
        }
        html5QrCodeScannerRef.current = null;
        setIsScanning(false);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onScanSuccess, onClose]); // Rerun if open changes

  const handleClose = () => {
    if (html5QrCodeScannerRef.current) {
        try {
          html5QrCodeScannerRef.current.clear();
        } catch (e) { console.error("Error clearing scanner on manual close", e)}
        html5QrCodeScannerRef.current = null;
    }
    setIsScanning(false);
    onClose();
  };


  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="qr-scanner-modal-title"
      aria-describedby="qr-scanner-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="qr-scanner-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Scan QR Code
        </Typography>
        {cameraError && <Alert severity="error" sx={{width: '100%', mb: 2}}>{cameraError}</Alert>}
        <div id={scannerRegionId} style={{ width: '100%', minHeight: '250px', position: 'relative' }}>
          {open && isScanning && !cameraError && (
            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                 <CircularProgress />
                 <Typography>Initializing Camera...</Typography>
            </Box>
           )}
        </div>
        <Typography variant="caption" sx={{ mt: 2 }}>
          Point your camera at a QR code.
        </Typography>
      </Box>
    </Modal>
  );
};

export default QrScannerModal;