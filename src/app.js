const express = require('express');
const connectDB = require('./config/database')
const app = express();
const UserModel = require('./models/user');
const { validateSignupData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');



app.use(express.json());
app.use(cookieParser())

app.post('/signup', async (req, res) => {

    //creating a new user obj
    try {
        //validation of data
        validateSignupData(req)
        //encrypt the passsword
        const {firstName, lastName, emailId, password}=req.body;
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
        res.status(400).send(err.message+' ERROR :');
    }
})

app.post('/login', async (req, res) => {
    try {
        
        const { emailId, password } = req.body;


        const user = await UserModel.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {

            // jwt token generation

            const token= await jwt.sign({_id:user._id},'DEV_MATCH_SECRET_KEY',{expiresIn:'1h'})

            //add the token to cookie and send the response back to the user

            res.cookie('token',token)
            




            res.send('Login successful');
        } else {
            throw new Error('Invalid email or password');
        }


    } catch (err) {
        res.status(400).send(err.message+' ERROR :');
        
    }
})

app.get('/profile', async (req, res) => { 
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        
        // validate token and get user data from db
        if (!token) {
            throw new Error('Not authorized, token missing');
        }


        const decodedMessage = await jwt.verify(token, 'DEV_MATCH_SECRET_KEY')
        const { _id } = decodedMessage;
        

        const user = await UserModel.findById(_id);
        if (!user) {
            throw new Error('User not found');
        }
        


        res.send(user)
    } catch (err) {
        res.status(400).send(err.message+' ERROR :');
        
    }
})

//get user by emailId



// update user

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body

    
    try {


        const allowedUpdates = ['photoUrl', 'about', 'gender', 'skills', 'education', 'experience', 'interests', 'achievements', 'languages',

        ];
        const isUpdateAllowed = Object.keys(data).every((key) => allowedUpdates.includes(key));
        if (!isUpdateAllowed) {
            throw new Error('update not allowed');
        }

        if (data?.skills.length > 10) {
            throw new Error('skills should not be more than 10');
        }


        const user = await UserModel.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: 'after',
            runValidators: true,

        });
        res.send('user updated successfully')
    } catch (err) {
        res.status(400).send(err.message + ' update failed');
    }
});
connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => console.log('Server started on port 3000'))
    })
    .catch(err => console.log(err, 'errrr'));
