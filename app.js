require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/sequelize');
const app = express();
const cors = require('cors');
const port = 5000 || process.env.PORT;
const FirstVersionRoutes = require('./routes/v1/DistributeRoutes');


app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


/**
 * Routes starts here
 */
app.use('/api/v1', FirstVersionRoutes);


sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(port, () => {
        console.log('Server started on port', port);
    });
}).catch((err) => {
    console.log('Error: ', err);
});