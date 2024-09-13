import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, MenuItem, 
    FormControl, InputLabel, Select, Paper, Box, CircularProgress, CssBaseline,
    Pagination,Card
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Firebase auth
import { styled } from '@mui/system'; // For styling animations
import ReactHtmlParser from 'html-react-parser'; // For rendering HTML content
import { motion } from 'framer-motion';

const SUPPORT_TASK_URL = 'http://localhost:3002/api/getTasks';
const departments = ['Support', 'Admin', 'Examination', 'IT'];

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

const AnimatedPaper = styled(Paper)(({ theme }) => ({
    transition: 'box-shadow 0.3s ease-in-out',
    border: `1px solid ${darkPurplePalette.primary}`, 
    backgroundColor: darkPurplePalette.background,
    color: darkPurplePalette.textPrimary,
    '&:hover': {
        boxShadow: `0 0 15px 5px ${darkPurplePalette.primary}`,
    },
}));

const TaskListItem = styled(Paper)(({ theme }) => ({
    padding: '10px 20px',
    marginBottom: '16px',
    transition: 'transform 0.2s, background-color 0.2s',
    cursor: 'pointer',
    border: `1px solid ${darkPurplePalette.secondary}`,
    borderRadius: '8px',
    backgroundColor: darkPurplePalette.background,
    color: darkPurplePalette.textPrimary,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:hover': {
        transform: 'scale(1.02)',
        backgroundColor: darkPurplePalette.primary,
        color: darkPurplePalette.textPrimary,
    },
}));

const PriorityBadge = styled(Typography)(({ priority }) => ({
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    color: '#fff',
    backgroundColor: priorityColors[priority] || '#9e9e9e',
    whiteSpace: 'nowrap', 
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis', 
}));

const SupportTaskPage = () => {
    const [department, setDepartment] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(4); // Adjust the number of tasks per page
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/sign-in');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (department && user) {
            fetchTasks();
        }
    }, [department, user]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${SUPPORT_TASK_URL}`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    list_name: department.toLowerCase(),
                    email: user.email,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setTasks(result.payload); // Store all tasks in state
        } catch (error) {
            setError('Error fetching tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDepartmentSelect = (selectedDepartment) => {
        setDepartment(selectedDepartment);
        setCurrentPage(1); // Reset page when department changes
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleBackToList = () => {
        setSelectedTask(null);
    };

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    // Calculate the tasks to be displayed on the current page
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
        <React.Fragment>
            <CssBaseline />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Container sx={{ maxWidth: 'lg', marginTop: 4, display: 'flex' }}>
                    <Box sx={{ flex: 1, paddingRight: 2 }}>
                        <AnimatedPaper elevation={6} sx={{ padding: 4, borderRadius: 4 }}>
                            <Typography variant="h4" align="center" gutterBottom sx={{ color: darkPurplePalette.textPrimary }}>
                                Select a Department to View Your Support Tickets
                            </Typography>
                            <FormControl fullWidth sx={{ marginBottom: 4 }}>
                                <InputLabel sx={{ color: darkPurplePalette.textPrimary }}>Department</InputLabel>
                                <Select
                                    value={department}
                                    onChange={(e) => handleDepartmentSelect(e.target.value)}
                                    label="Department"
                                    sx={{ color: darkPurplePalette.textPrimary }}
                                >
                                    {departments.map((dept) => (
                                        <MenuItem key={dept} value={dept} sx={{ color: darkPurplePalette.textPrimary }}>
                                            {dept}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {loading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                                    <CircularProgress />
                                </Box>
                            )}
                            {error && <Typography style={{ color: 'red', marginTop: 2 }}>{error}</Typography>}

                            {!selectedTask && (
                                <div>
                                    <Typography variant="h6" gutterBottom sx={{ color: darkPurplePalette.textPrimary }}>
                                        Tasks for {department}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        {currentTasks.length > 0 ? (
                                            currentTasks?.map((task) => (
                                              <Card
                                              sx={{
                                                borderRadius: "10px",
                                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                                p: "25px",
                                                mb: "15px",
                                              }}
                                              >
                                                <TaskListItem key={task.id} onClick={() => handleTaskClick(task)} sx={{ flex: '1 1 calc(50% - 16px)' }}>
                                                    <Typography variant="h6" sx={{ color: darkPurplePalette.textPrimary }}>
                                                        {task.name}
                                                    </Typography>
                                                    <PriorityBadge priority={task.priority.priority}>
                                                        {task.priority.priority}
                                                    </PriorityBadge>
                                                </TaskListItem>
                                                </Card>  
                                            ))
                                        ) : (
                                            <Typography sx={{ color: darkPurplePalette.textPrimary }}>
                                                No tasks available.
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                        <Pagination
                                            count={Math.ceil(tasks.length / tasksPerPage)}
                                            page={currentPage}
                                            onChange={handleChangePage}
                                            color="secondary"
                                            sx={{ color: darkPurplePalette.textPrimary }}
                                        />
                                    </Box>
                                </div>
                            )}
                        </AnimatedPaper>
                    </Box>

                    {/* Task Details */}
                    {selectedTask && (
                        <Box sx={{ flex: 2, paddingLeft: 2 }}>
                            <AnimatedPaper elevation={6} sx={{ padding: 4, borderRadius: 4, height: '100%' }}>
                                <Typography variant="h5" gutterBottom sx={{ color: darkPurplePalette.textPrimary }}>
                                    {selectedTask.name}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{ color: darkPurplePalette.textSecondary }}>
                                    {ReactHtmlParser(selectedTask.description)}
                                </Typography>
                                <Typography variant="body1" sx={{ color: darkPurplePalette.textSecondary, marginBottom: 2 }}>
                                    <strong>Priority:</strong>{' '}
                                    <PriorityBadge priority={selectedTask.priority.priority}>
                                        {selectedTask.priority.priority}
                                    </PriorityBadge>
                                </Typography>
                                <Typography variant="body1" sx={{ color: darkPurplePalette.textSecondary, marginBottom: 2 }}>
                                    <strong>Tags:</strong> {selectedTask.tags.join(', ')}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    onClick={handleBackToList} 
                                    sx={{ marginTop: 2 }}
                                >
                                    Back to Task List
                                </Button>
                            </AnimatedPaper>
                        </Box>
                    )}
                </Container>
            </motion.div>
        </React.Fragment>
    );
};

export default SupportTaskPage;
