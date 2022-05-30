const mongoose = require('mongoose');

// Database 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/issue_tracker_development');

// make connection to db 
const db = mongoose.connection;

// Throw error when not able to establish connection with data 
db.on('error', console.log.bind(console, 'Error connecting to MongoDB!'));

// To check is successfully connected to database 
db.once('open',function(){
    console.log('Connected to Database');
});

module.exports = db;