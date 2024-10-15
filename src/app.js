const express = require('express');
const connectDB = require('./config/database')
const app = express();
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser');

app.use(cookieParser())
app.use(express.json());

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)



// const authRouter = require('./routes/auth');


connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => console.log('Server started on port 3000'))
    })
    .catch(err => console.log(err, 'errrr'));
