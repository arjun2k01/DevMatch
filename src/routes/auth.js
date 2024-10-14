const express = require('express');
const authRouter = express.Router();
const UserModel = require('../models/user');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
authRouter.use(express.json());
authRouter.post('/signup', async (req, res) => {

    //creating a new user obj
    try {
        //validation of data
        validateSignupData(req)
        //encrypt the passsword
        const { firstName, lastName, emailId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new UserModel({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        });

        await user.save();
        res.send('User created successfully');
    } catch (err) {
        res.status(400).send(err.message + ' ERROR :');
    }
})

authRouter.post('/login', async (req, res) => {
    try {

        const { emailId, password } = req.body;


        const user = await UserModel.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {

            // jwt token generation

            const token = await user.getJWT()

            //add the token to cookie and send the response back to the user

            res.cookie('token', token, { expires: new Date(Date.now() + 7 * 24 * 3600000) })





            res.send('Login successful');
        } else {
            throw new Error('Invalid email or password');
        }


    } catch (err) {
        res.status(400).send(err.message + ' ERROR :');

    }
})

authRouter.post('/logout', async (req, res) => {
    try {

        
        res.cookie('token', '', { expires: new Date(Date.now() - 1000) })
        res.send('Logout successful');
    } catch (err) {
        res.status(400).send(err.message + ' ERROR :');

    }
})




module.exports = authRouter;