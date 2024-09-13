import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Box, Grid, AppBar, Toolbar, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import SupportTaskPage from './displayTasks'; // Import your department selection component
import SupportForm from './SupportPage'; // Import the SupportForm component
import ITULogo from './itu-logo.png'; // Import ITU logo

const darkPurplePalette = {
    primary: '#4a148c',    // Dark Purple
    secondary: '#6d28d9',  // Medium Purple
    background: '#1e1e2d', // Darker Background
    textPrimary: '#ffffff', // White text color
    textSecondary: '#ffffff', // White text color
};

// Define the fixed height for the HeaderAppBar
const headerHeight = '64px'; // Adjust this value based on your actual header height

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: darkPurplePalette.primary,
    zIndex: theme.zIndex.drawer + 1,
    height: headerHeight,
    '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-50%',
        width: '200%',
        height: '100%',
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
        animation: 'slide 4s infinite linear',
    },
    '@keyframes slide': {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
    },
}));

const ContentContainer = styled(Container)(({ theme }) => ({
    marginTop: headerHeight, // Set margin top to match header height
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
}));

const GridItem = styled(Grid)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
}));

const DisplayTasksPage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                setUser(null);
            })
            .catch((error) => {
                console.error('Error during sign-out:', error.message);
            });
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    return (
        <>
            <HeaderAppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={ITULogo} alt="ITU Logo" style={{ width: '50px', marginRight: '10px' }} />
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            University Support
                        </Typography>
                    </Box>
                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <Avatar src={user.photoURL} sx={{ marginRight: 2 }} />
                            <Typography variant="body1" sx={{ marginRight: 2 }}>
                                {user.email}
                            </Typography>
                            <Button color="inherit" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </Box>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/sign-in')} sx={{ marginLeft: 'auto' }}>
                            Sign In with Google
                        </Button>
                    )}
                </Toolbar>
            </HeaderAppBar>
            <ContentContainer maxWidth="lg">
                <Grid container spacing={4}>
                    {/* <Grid item xs={12} md={12}>
                        <GridItem>
                            <SupportTaskPage />
                        </GridItem>
                    </Grid> */}
                    <Grid item xs={12} md={6}>
                        <GridItem>
                            <SupportForm />
                        </GridItem>
                    </Grid>
                </Grid>
            </ContentContainer>
        </>
    );
};

export default DisplayTasksPage;
