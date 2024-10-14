const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth')
const validateEditProfileData = require('../utils/validation')

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const cookies = req.cookies;  // Ensure cookie-parser is being used
        const { token } = cookies;

        // Validate token
        if (!token) {
            throw new Error('Not authorized, token missing');
        }

        // Verify token
        const decodedMessage = jwt.verify(token, 'DEV_MATCH_SECRET_KEY');  // Remove `await` if using sync method
        const { _id } = decodedMessage;

        // Check if user is set in `req.user`
        const user = req.user;
        if (!user) {
            throw new Error('User not found');
        }

        res.send(user);  // Send the user data
    } catch (err) {
        res.status(400).send(`${err.message} ERROR :`);  // Send a more descriptive error message
    }
});
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (validateEditProfileData(req)) {
            throw new Error('Invalid edit req');
        };

        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => (
            loggedInUser[key] = req.body[key]

        ));
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile has been updated successfully`,
            data: loggedInUser
        })

    } catch (error) {
        res.status(400).send('Error :' + error.message)
    }
})
profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        
    } catch (error) {
        
    }
})
module.exports = profileRouter;