const express = require('express');
const connectDB = require('./config/database')
const app = express();
const UserModel = require('./models/user');
app.use(express.json());

app.post('/signup', async (req, res) => {
  
    //creating a new user obj
    const user = new UserModel(req.body);
    try {
        await user.save();
        res.send('User created successfully');
    } catch (err) { 
        res.status(400).send(err.message+'error aya');
    }
})
// update user

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const data = req.body
    try {
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
