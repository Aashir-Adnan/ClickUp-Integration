const CLICKUP_API_URL = 'https://api.clickup.com/api/v2';
const CLICKUP_TOKEN = process.env.CLICKUP_API_TOKEN;
const FormData = require('form-data');
const axios = require('axios');
async function addFileToTask(file, taskId){
    try{
        {
            const form = new FormData();
            form.append('attachment', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
            const formHeaders = form.getHeaders();
            await axios.post(
                `${CLICKUP_API_URL}/task/${taskId}/attachment`,
                form,
                {
                    headers: {
                        ...formHeaders,
                        Authorization: `Bearer ${CLICKUP_TOKEN}`,
                    },
                }
            )
        }
    }
    catch(error){
        throw new Error("POST FILE TO SUPPORT : " + error);
    }
}

module.exports = addFileToTask;