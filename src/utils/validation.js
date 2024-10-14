const validator = require('validator');


const validateSignupData = (req) => { 
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName || !emailId || !password) { 
        throw new Error('All fields are required');
    }

    else if (firstName.length < 4 || firstName.length > 20) {
        throw new Error('First name should be between 4 and 20 characters');
    }

    else if (lastName.length < 4 || lastName.length > 20) {
        throw new Error('Last name should be between 4 and 20 characters');
}

    else if (!validator.isEmail(emailId)) {
        throw new Error('Invalid email address');
    }

    else if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new Error('Password should be between 8 and 20 characters');
    }

    return true;
}


validateEditProfileData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'emailId', 'photoUrl',
        'gender', 'age', 'about', 'skills'
    ];
    const isEditAllowed = wedObject.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}
module.exports = { validateSignupData };