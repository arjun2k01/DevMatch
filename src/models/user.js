const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt'); // Make sure bcrypt is imported
const jwt = require('jsonwebtoken'); // Make sure jwt is imported

const userSchema = new mongoose.Schema({
    
    
    
    firstName: {
        type: String,
        required: true,
        index: true,
        minLength: 2,
        maxLength: 50,

    },
    lastName: {
        type: String,
        maxLength: 50,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email: ' + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
                throw new Error('Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol');
            }
        }
    },
    age: {
        type: Number,
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
                throw new Error('Invalid photo URL: ' + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is a default description",
    },
    skills: {
        type: [String],
    }
});

// Method to generate JWT token
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, 'DEV_MATCH_SECRET_KEY', { expiresIn: '7d' });
    return token;
};

// Method to validate the password
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashedPassword);
    return isPasswordValid;
};

// Create the model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
