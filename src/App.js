import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SupportForm from './SupportPage'; // Adjust the import based on your file structure
import SignIn from './SignIn'; // Import your SignIn component
import DisplayTasksPage from './Combined';
import SupportTaskPage from './displayTasks';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark' depending on your preference
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#115293', // Example hover color override
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/support-form" element={<SupportForm />} />
          <Route path="/displayTasks" element={<SupportTaskPage />} />
          <Route path= "/sign-in" element = {<SignIn/>} />
          <Route path= "/combined" element = {<DisplayTasksPage/>} />
          <Route path="/" element={<SignIn/>} /> {/* Redirect root to SignIn */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
