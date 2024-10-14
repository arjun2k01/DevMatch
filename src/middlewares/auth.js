const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');


const userAuth = async (req, res, next) => { 
    // read the token from the req cookies
    try {
        const cookies = req.cookies;
        const { token } = cookies;

        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }
        const decodedObj = await jwt.verify(token, 'DEV_MATCH_SECRET_KEY');
        const { _id } = decodedObj;
        const user = await UserModel.findById(_id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    }
    catch (error) { 
        res.status(401).json({ message: 'Invalid token' }+ error.message);
    }
    // validate the token
    //Find the user from the token
}
module.exports = userAuth;