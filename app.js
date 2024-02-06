const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/sequelize');
const app = express();
const port = 5000 || process.env.PORT;



sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(port, () => {
        console.log('Server started on port', port);
    });
}).catch((err) => {
    console.log('Error: ', err);
});