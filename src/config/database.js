const mongoose = require('mongoose');

const connectDB = async () => {
    
    await mongoose.connect('mongodb+srv://nodejs:nodejs@nodejs.vf1go.mongodb.net/DevMatch')
}
module.exports = connectDB;