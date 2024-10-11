const mongoose = require('mongoose');

const connectDB = async () => {
    
    await mongoose.connect('mongodb+srv://nodejs:qDbX0R1qLDF0qUjG@nodejs.vf1go.mongodb.net/DevMatch')
}
module.exports = connectDB;