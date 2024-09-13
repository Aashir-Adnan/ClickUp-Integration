const express = require('express');
require('dotenv').config();
const app = express();
const PORT = 3002;
const bodyparser = require('body-parser');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, 
    fileFilter: function (req, file, cb) {
        cb(null, true);
    }
});

const handleAddSupportTask = require('./Post_Requests/handleAddSupportTask.js');
const handleGetTasksByEmail = require('./Get_Requests/getTaskByEmail.js');
const router = express.Router();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // or specify a specific origin
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyparser.json());
app.use('/api', router);
router.post('/supportTask', upload.array('files', 10), (req, res) => {
    handleAddSupportTask(req, res);
});
router.post('/getTasks', (req, res) =>{
    handleGetTasksByEmail(req, res);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
