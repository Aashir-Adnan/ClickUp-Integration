const sendResponse = require("../Constants/response");
const CLICKUP_API_URL = 'https://api.clickup.com/api/v2';
const CLICKUP_TOKEN = process.env.CLICKUP_API_TOKEN;
const axios = require('axios');
const listMapper = require('../Constants/listIdMapper');

async function handleGetTasksByEmail(list_name, email) {
    try {
        console.log(list_name + "     " + email);
        if (!list_name || !email) {
            return sendResponse(res, 400, "Missing required parameters: list_name and email");
        }

        const list_id = listMapper[list_name.toLowerCase()];
        if (!list_id) {
            return sendResponse(res, 400, "Invalid list name");
        }
        const response = await axios.get(`${CLICKUP_API_URL}/list/${list_id}/task`, {
            headers: {
                Authorization: `Bearer ${CLICKUP_TOKEN}`,
            }
        });
        const tasks = response.data.tasks.filter(task => {
            const description = task.description || '';
            const emailInDescription = description.match(/email:\s*([^\s]+)/);
            return emailInDescription && emailInDescription[1] === email;
        });
        console.log(tasks);
        sendResponse(res, 200, "Tasks retrieved successfully", tasks);

    } catch (error) {
        console.error('Error fetching tasks:', error);
        return sendResponse(res, 500, "Error fetching tasks", error);
    }
}

module.exports = handleGetTasksByEmail;
