const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./Config')
const mongoose = require('mongoose');

// Cron job file
require('./cron');

// Initialization
const app = express();

// Server third party cofiguration
app.use(cors());
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/user');

// Server config port and environment 
const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV;

// Mongoose connection
mongoose.connect(config.MONGO_URI[environment], {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('error', error=>{
	console.log(error);
})

// Routes
app.use('/api', userRoutes);
app.get("*", (req, res)=>{
	return res.status(404).json({ success: false, msg: "Wrong api"})
})

app.listen(PORT, ()=>{
	console.log(`Server is running on ${PORT}`)
})