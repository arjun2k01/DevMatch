const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email'+ value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }))
                throw new Error('Password should be at least 8 characters long and should contain at least one lowercase letter, one uppercase letter, one number and one symbol');
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    photoUrl: {
        type: String,
        default: "https://via.placeholder.com/150",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid photo|address'+ value);
            }
        }
        
    },
    about: {
        type: String,
        default: "This is a default"
    },
    skills: {
        type: [String],
        required: true,     
    }
});

// Create the model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
