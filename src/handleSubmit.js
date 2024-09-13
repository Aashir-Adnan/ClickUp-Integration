const SUPPORT_TASK_URL = 'http://localhost:3002/api/supportTask';

const handleSubmit = async () => {
    if (user) {
        const userEmail = user.email;
        if (userEmail && userEmail.endsWith('@itu.edu.pk')) {
            try {
                const formData = new FormData();
                formData.append('description', description);
                formData.append('priority', priority);
                formData.append('department', department);
                tags.forEach((tag) => formData.append('tags[]', tag));
                files.forEach((file) => formData.append('files', file));

                const response = await fetch(SUPPORT_TASK_URL, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Form submitted successfully:', result);
                setDescription('');
                setPriority('');
                setTags([]);
                setDepartment('');
                setFiles([]);
            } catch (error) {
                console.error('Error during form submission:', error);
            }
        } else {
            setShowNonITUMessage(true);
        }
    } else {
        setShowSignInPopup(true);
    }
};
