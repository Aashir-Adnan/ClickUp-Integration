const listIdMapper = require('./listIdMapper.js');

// Create a closure to keep track of the counter
let counter = 1;

function taskPayloadBuilder(req) {
    try {
        const { priority, email, tag, description, department } = req;
        
        const List_ID = listIdMapper[department.toLowerCase()] || listIdMapper.default;

        const taskPayload = {
            name: `Issue ${counter++}: ${description}`,
            description: `email: ${email} \n description: ${description}`,
            assignees: ['102807161'],
            priority:  priority === 'Low' ? 4 : priority === 'Medium' ? 3 : priority === 'High' ? 2 : 4,
            tags: tag,
            start_date: Date.now(),
            list_id: List_ID
        };

        return taskPayload;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = taskPayloadBuilder;
