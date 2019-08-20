const express = require('express');
const mongoose  = require('mongoose');
const app = express();
const userRoutes = require('./routes/user');
const teamRoutes = require('./routes/team');
const fixtureRoutes = require('./routes/fixture');
const adminRoutes = require('./routes/admin');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json());

app.use('/api/team', teamRoutes);
app.use('/api/admin',adminRoutes)
app.use('/api/user', userRoutes);
app.use('/api/fixture', fixtureRoutes);


mongoose.connect(process.env.DB_CONNECTION_STRING,{ useNewUrlParser: true }, ()=> console.log('connected'))

const port = process.env.port || 5000;
app.listen(port);