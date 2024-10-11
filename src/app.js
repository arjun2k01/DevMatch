const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user');
app.use(express.json());
app.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.send('User created successfully')
    } catch (err) {
        res.status(400).send(err)
    }

})


connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => console.log('Server started on port 3000'))
    })
    .catch(err => console.log(err, 'errrr'));
