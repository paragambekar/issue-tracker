const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/issue_tracker_development');

const db = mongoose.connection;

db.on('error', console.log.bind(console, 'Error connecting to MongoDB!'));

db.once('open',function(){
    console.log('Connected to Database');
});

module.exports = db;