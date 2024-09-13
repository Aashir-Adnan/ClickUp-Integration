import axios from 'axios';
import addFileToTask from '../Constants/postFileToSupportTask';
import taskPayloadBuilder from '../Constants/taskPayloadBuilder';
const CLICKUP_API_URL = 'https://api.clickup.com/api/v2';
const CLICKUP_TOKEN = '102807161_21a1c9f88080584fee78a4866937c85a86f0bd0841d7b5ff81357c98ede69bac';

async function handleAddSupportTask(files, req) {
    try {
        const taskPayload = taskPayloadBuilder(req);
        
        console.log('Task Payload:', JSON.stringify(taskPayload, null, 2));
        console.log("TOKEN :: ", CLICKUP_TOKEN)
        
        const taskResponse = await axios.post(`${CLICKUP_API_URL}/list/${taskPayload.list_id}/task`, taskPayload, {
            headers: {
                Authorization: `Bearer ${CLICKUP_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Task Response:', taskResponse);    
        
        const taskId = taskResponse.data.id;
        if (files && files.length > 0) {
            for (const file of files) {
                await addFileToTask(file, taskId);
            }
        }
    } catch (error) {
        if (error.response) {
            console.log('Response error:', error.response.data);
            console.log('Response status:', error.response.status);
            console.log('Response headers:', error.response.headers);
        } else if (error.request) {
            console.log('Request error:', error.request);
        } else {
            console.log('Error message:', error.message);
        }
        console.log('Error config:', error.config);
        throw error;
    }
}

export default handleAddSupportTask;
