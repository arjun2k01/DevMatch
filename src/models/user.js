const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxLength: 50,

    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true, // Ensure this is correct
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100,
    },
    gender: {
        type: String,
        validate(value) {
            if (!['Male', 'Female', 'Other'].includes(value)) {
                throw new Error('Gender must be Male, Female or Other');
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://via.placeholder.com/150"
    },
    about: {
        type: String,
        default: "This is a default"
    },
    skills: {
        type: [String],
        required: true,
    },
    
},
    {
        timestamps: true 
        
    }
);

// Create the model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
