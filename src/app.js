const express = require('express');
const app = express();

app.use('/user',(req,res)=> {
    //route handler
    res.send('Hello from user route');
})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    
});