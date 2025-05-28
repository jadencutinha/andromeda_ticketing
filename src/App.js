// src/App.js
import React, { useState } from 'react';
import EventBrowser from './EventBrowser';
import FilterBar from './FilterBar';
import TicketScanner from './TicketScanner'; // Import the new TicketScanner component
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb'; // Example Icon for AppBar
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';

function App() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [walletConnected, setWalletConnected] = useState(false); // Placeholder state
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('browser'); // 'browser' or 'scanner'

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2', // Adjust colors for dark/light
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
          },
          background: {
            default: darkMode ? '#121212' : '#f4f6f8', // Lighter grey for light, dark for dark
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          }
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 500,
          }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8, // Slightly more rounded buttons
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 12, // Rounded corners for paper elements
                    }
                }
            },
            MuiCard: {
                 styleOverrides: {
                    root: {
                        borderRadius: 12, // Rounded corners for cards
                    }
                 }
            }
        }
      }),
    [darkMode],
  );

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  const handleConnectWallet = () => {
    // Placeholder for actual wallet connection logic (e.g., using ethers.js, web3-react, wagmi)
    console.log("Attempting to connect wallet...");
    // This would involve interacting with browser extensions like MetaMask
    setWalletConnected(!walletConnected); // Toggle for now
    alert(walletConnected ? "Wallet disconnected (simulated)" : "Wallet connection logic to be implemented!");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies baseline styles and dark mode background */}
      <AppBar position="sticky" elevation={2} sx={{ mb: {xs: 2, md: 4} }}>
        <Container maxWidth="lg">
            <Toolbar disableGutters>
                <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'inherit' }} />
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    NFTix
                </Typography>
                {/* Responsive Title for smaller screens */}
                 <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                 <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href=""
                    sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    }}
                >
                    NFTix
                </Typography>

                <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
                <Button
                    color="inherit"
                    onClick={() => handleViewChange('browser')}
                    sx={{ ml: 1, borderColor: 'rgba(255,255,255,0.5)' }}
                >
                    Browse Events
                </Button>
                <Button
                    color="inherit"
                    onClick={() => handleViewChange('scanner')}
                    sx={{ ml: 1, borderColor: 'rgba(255,255,255,0.5)' }}
                >
                    Scan Tickets
                </Button>
                <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <Button
                    color="inherit"
                    variant="outlined"
                    onClick={handleConnectWallet}
                    sx={{ ml: 1, borderColor: 'rgba(255,255,255,0.5)' }}
                >
                    {walletConnected ? "Wallet Connected" : "Connect Wallet"}
                </Button>
            </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg">
        {currentView === 'browser' ? (
          <>
            <FilterBar onCategoryChange={handleCategoryChange} />
            <EventBrowser categoryFilter={categoryFilter} />
          </>
        ) : (
          <TicketScanner />
        )}
      </Container>

      <Box component="footer" sx={{ textAlign: 'center', mt: 6, py: 3, backgroundColor: 'action.hover' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} NFT Ticketing dApp. All Rights Reserved.
        </Typography>
        <Typography variant="caption" color="text.secondary">
            Powered by React & Material-UI. Ready for Blockchain Integration.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;