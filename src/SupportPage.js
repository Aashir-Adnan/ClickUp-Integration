import React, { useState, useEffect } from 'react';
import { Container, TextField, MenuItem, Button, Typography, Box, Grid, InputLabel, FormControl, Select, Chip, Paper, CssBaseline, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import handleAddSupportTask from './intermediary/Post_Requests/handleAddSupportTask';

const priorityColors = {
    low: '#4caf50',       // Green
    medium: '#ff9800',    // Orange
    high: '#f44336'       // Red
};

const darkPurplePalette = {
    primary: '#4a148c',    // Dark Purple
    secondary: '#6d28d9',  // Medium Purple
    background: '#1e1e2d', // Darker Background
    textPrimary: '#ffffff', // White text color
    textSecondary: '#ffffff', // White text color
};

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiInputLabel-root': {
        color: darkPurplePalette.textPrimary,
        transition: 'all 0.3s ease',
    },
    '& .MuiInputBase-root': {
        color: darkPurplePalette.textPrimary,
        backgroundColor: darkPurplePalette.background,
        transition: 'all 0.3s ease',
    },
    '& .MuiInputBase-root:hover': {
        backgroundColor: darkPurplePalette.secondary,
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: darkPurplePalette.primary,
    color: darkPurplePalette.textPrimary,
    '&:hover': {
        backgroundColor: darkPurplePalette.secondary,
    },
}));

const FileInputButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    width: '100%',
    backgroundColor: darkPurplePalette.secondary,
    color: darkPurplePalette.textPrimary,
    '&:hover': {
        backgroundColor: darkPurplePalette.primary,
    },
}));

const AnimatedPaper = styled(Paper)(({ theme }) => ({
    transition: 'box-shadow 0.3s ease-in-out',
    border: `1px solid ${darkPurplePalette.primary}`, // Use primary color for the border
    backgroundColor: darkPurplePalette.background,
    color: darkPurplePalette.textPrimary,
    '&:hover': {
        boxShadow: `0 0 15px 5px ${darkPurplePalette.primary}`, // Use primary color for the glow effect
    },
}));

const SupportForm = () => {
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [tag, setTags] = useState([]);
    const [department, setDepartment] = useState('');
    const [files, setFiles] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('success');
    const departments = ['Support', 'Admin', 'Examination', 'IT'];
    const availableTags = ['Bug', 'Feature', 'Suggestion'];

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    const handleTagChange = (event) => {
        const { value } = event.target;
        setTags(typeof value === 'string' ? value.split(',') : value);
    };

    const handleFileChange = (event) => {
        setFiles([...event.target.files]);
    };

    const handleSubmit = async () => {
        if (user) {
            setLoading(true);
            try {
                // Create the request object with the specified fields
                const req = {
                    description,
                    priority,
                    department,
                    email: user.email,
                    tag: tag.map((t) => t.toLowerCase()), // converting tags to lowercase as required
                };
    
                // Call handleAddSupportTask with files and req object
                await handleAddSupportTask(files, req);
                // Reset form fields upon successful submission
                setDescription('');
                setPriority('');
                setTags([]);
                setDepartment('');
                setFiles([]);
    
                // Display success dialog
                setDialogMessage('Form submitted successfully!');
                setDialogType('success');
                setDialogOpen(true);
            } catch (error) {
                // Handle errors
                setDialogMessage('Error during form submission. Please try again. ' + error);
                setDialogType('error');
                setDialogOpen(true);
            } finally {
                setLoading(false);
            }
        } else {
            navigate('/sign-in');
        }
    };
    
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Container maxWidth="md">
                        {!loading ? (
                            <>
                                <AnimatedPaper elevation={6} sx={{ padding: 4, borderRadius: 4 }}>
                                    <Typography variant="h4" align="center" gutterBottom>
                                        Support Form
                                    </Typography>
                                    <Box component="form" mt={4} noValidate autoComplete="off">
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Describe your issue"
                                                    variant="outlined"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    multiline
                                                    rows={4}
                                                    InputProps={{ style: { color: darkPurplePalette.textPrimary } }}
                                                    InputLabelProps={{ style: { color: darkPurplePalette.textPrimary } }}
                                                    sx={{ backgroundColor: darkPurplePalette.background }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Priority"
                                                    variant="outlined"
                                                    value={priority}
                                                    onChange={(e) => setPriority(e.target.value)}
                                                    select
                                                    InputProps={{ style: { color: darkPurplePalette.textPrimary } }}
                                                    InputLabelProps={{ style: { color: darkPurplePalette.textPrimary } }}
                                                    sx={{ backgroundColor: darkPurplePalette.background }}
                                                >
                                                    <MenuItem value="Low" style={{ color: priorityColors.low }}>Low</MenuItem>
                                                    <MenuItem value="Medium" style={{ color: priorityColors.medium }}>Medium</MenuItem>
                                                    <MenuItem value="High" style={{ color: priorityColors.high }}>High</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledFormControl fullWidth variant="outlined">
                                                    <InputLabel sx={{ color: darkPurplePalette.textPrimary }}>Tags</InputLabel>
                                                    <Select
                                                        multiple
                                                        value={tag}
                                                        onChange={handleTagChange}
                                                        renderValue={(selected) => (
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                {selected.map((value) => (
                                                                    <Chip
                                                                        key={value}
                                                                        label={value}
                                                                        sx={{ backgroundColor: darkPurplePalette.textPrimary, color: darkPurplePalette.background }}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        )}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                sx: {
                                                                    backgroundColor: darkPurplePalette.background,
                                                                    color: darkPurplePalette.textPrimary,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {availableTags.map((tag) => (
                                                            <MenuItem key={tag} value={tag} sx={{ color: darkPurplePalette.textPrimary }}>
                                                                {tag}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </StyledFormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledFormControl fullWidth variant="outlined">
                                                    <InputLabel>Department</InputLabel>
                                                    <Select
                                                        value={department}
                                                        onChange={(e) => setDepartment(e.target.value)}
                                                    >
                                                        {departments.map((dept) => (
                                                                <MenuItem key={dept} value={dept}>
                                                                {dept}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </StyledFormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FileInputButton
                                                    variant="contained"
                                                    component="label"
                                                    startIcon={<AttachFileIcon />}
                                                >
                                                    Upload Files
                                                    <input
                                                        type="file"
                                                        multiple
                                                        hidden
                                                        onChange={handleFileChange}
                                                    />
                                                </FileInputButton>
                                                <List>
                                                    {files.map((file, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemIcon>
                                                                <AttachFileIcon sx={{ color: darkPurplePalette.textPrimary }} />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={file.name}
                                                                sx={{ color: darkPurplePalette.textPrimary }}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledButton
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                >
                                                    Submit
                                                </StyledButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </AnimatedPaper>
                            </>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                                <CircularProgress sx={{ color: darkPurplePalette.primary }} />
                            </Box>
                        )}
                    </Container>
                </motion.div>
            </div>

            {/* Dialog to show success/error messages */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{dialogType === 'success' ? 'Success' : 'Error'}</DialogTitle>
                <DialogContent>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default SupportForm;

