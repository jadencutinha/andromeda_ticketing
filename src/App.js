// src/App.js
import React, { useState, useEffect, useMemo, useCallback } from 'react'; // Ensure all hooks are imported
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
// import { ethers } from 'ethers'; // Commented out - not used for Keplr directly

// --- ALL TOP-LEVEL IMPORTS ---
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // createTheme and ThemeProvider are from here
import CssBaseline from '@mui/material/CssBaseline';               // CssBaseline is from here
import IconButton from '@mui/material/IconButton';
import AdbIcon from '@mui/icons-material/Adb';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import EventBrowser from './EventBrowser';
import FilterBar from './FilterBar'; 
import TicketPurchasePage from './TicketPurchasePage';
import TicketInteractionModal from './TicketInteractionModal';
// --- END OF IMPORTS ---

const ANDROMEDA_CHAIN_ID = "andromeda-1"; 

const KEPLR_INSTALL_URL = "https://www.keplr.app/download";

const AppHeader = ({
  darkMode,
  toggleDarkMode,
  walletConnected,
  connectedAccount,
  handleConnectWallet,
  handleDisconnectWallet,
  handleOpenInteractionModal,
}) => {
  return (
    <AppBar position="sticky" elevation={2} sx={{ mb: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'inherit' }} />
          <Typography variant="h6" noWrap component={RouterLink} to="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.1rem', color: 'inherit', textDecoration: 'none' }}>
            NeuraTicket
          </Typography>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography variant="h5" noWrap component={RouterLink} to="/" sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.1rem', color: 'inherit', textDecoration: 'none' }}>
            NeuraTicket
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton title="Ticket Interaction" color="inherit" onClick={handleOpenInteractionModal} sx={{ mr: 1 }}><QrCodeScannerIcon /></IconButton>
          <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
          
          {walletConnected && connectedAccount ? (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, p:0.5, border: '1px solid rgba(255,255,255,0.23)', borderRadius: 1 }}>
               <AccountBalanceWalletIcon sx={{fontSize: '1.2rem', mr: 0.5, color: 'inherit'}} />
              <Typography sx={{ mr: 1, fontSize: '0.8rem', display: { xs: 'none', sm: 'block' } }}>
                {`${connectedAccount.substring(0, 8)}...${connectedAccount.substring(connectedAccount.length - 5)}`}
              </Typography>
              <Button color="inherit" variant="text" onClick={handleDisconnectWallet} size="small" sx={{ textTransform: 'none', minWidth: 'auto', p: '2px 8px'}}>
                Disconnect
              </Button>
            </Box>
          ) : (
            <Button
              color="inherit" variant="outlined" onClick={handleConnectWallet}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{ ml: 1, borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Connect Keplr
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};


function App() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [interactionModalOpen, setInteractionModalOpen] = useState(false);

  const theme = useMemo( // Using useMemo directly as it's imported
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: darkMode ? '#90caf9' : '#1976d2' },
          secondary: { main: darkMode ? '#f48fb1' : '#dc004e' },
          background: { default: darkMode ? '#121212' : '#f4f6f8', paper: darkMode ? '#1e1e1e' : '#ffffff' }
        },
        typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', h4: { fontWeight: 600 }, h5: { fontWeight: 500 } },
        components: {
            MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
            MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
            MuiCard: { styleOverrides: { root: { borderRadius: 12 } } }
        }
      }),
    [darkMode],
  );

  const handleCategoryChange = useCallback((category) => setCategoryFilter(category), []);
  const toggleDarkMode = useCallback(() => setDarkMode(prevMode => !prevMode), []);
  const handleOpenInteractionModal = useCallback(() => setInteractionModalOpen(true), []);
  const handleCloseInteractionModal = useCallback(() => setInteractionModalOpen(false), []);

  const connectToKeplr = useCallback(async () => {
    if (!window.keplr) {
      alert("Keplr wallet extension is not installed. Please install it to continue.");
      const installKeplr = window.confirm("Would you like to go to the Keplr installation page?");
      if (installKeplr) window.open(KEPLR_INSTALL_URL, "_blank");
      return;
    }
    try {
      await window.keplr.enable(ANDROMEDA_CHAIN_ID);
      const offlineSigner = window.keplr.getOfflineSigner(ANDROMEDA_CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        setConnectedAccount(account.address);
        setWalletConnected(true);
        console.log('Keplr wallet connected:', account.address);
        const key = await window.keplr.getKey(ANDROMEDA_CHAIN_ID);
        console.log('Connected to chain name (from Keplr):', key.name);
      } else {
        alert('No accounts found in Keplr for this chain.');
      }
    } catch (error) {
      console.error('Error connecting to Keplr wallet:', error);
      alert(`Error connecting Keplr: ${error.message || "An unknown error occurred."}`);
    }
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    setWalletConnected(false);
    setConnectedAccount('');
    console.log('Keplr wallet disconnected (from dApp state)');
  }, []);

  useEffect(() => {
    const keplrChangeHandler = () => {
      console.log("Keplr key store changed.");
      if (walletConnected) {
        alert("Your Keplr account or network may have changed. Please reconnect if necessary.");
        handleDisconnectWallet();
      }
    };
    if (window.keplr) {
      window.addEventListener("keplr_keystorechange", keplrChangeHandler);
    }
    return () => {
      if (window.keplr) {
        window.removeEventListener("keplr_keystorechange", keplrChangeHandler);
      }
    };
  }, [walletConnected, handleDisconnectWallet]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppHeader
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          walletConnected={walletConnected}
          connectedAccount={connectedAccount}
          handleConnectWallet={connectToKeplr}
          handleDisconnectWallet={handleDisconnectWallet}
          handleOpenInteractionModal={handleOpenInteractionModal}
        />
        <TicketInteractionModal
            open={interactionModalOpen}
            onClose={handleCloseInteractionModal}
        />
        <Container maxWidth="lg">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <FilterBar onCategoryChange={handleCategoryChange} />
                  <EventBrowser categoryFilter={categoryFilter} />
                </>
              }
            />
            <Route 
              path="/event/:eventId/purchase" 
              element={<TicketPurchasePage walletConnected={walletConnected} />} 
            />
          </Routes>
        </Container>
        <Box component="footer" sx={{ textAlign: 'center', mt: 6, py: 3, backgroundColor: 'action.hover' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} NFT Ticketing dApp. All Rights Reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
              Powered by React & NeuraTicket.
          </Typography>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;