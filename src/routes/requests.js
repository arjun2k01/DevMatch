const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middlewares/auth')
const connectionRequestModel = require('../models/connectionRequest');
const UserModel = require('../models/user');
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try { 
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        const allowedStatus = ['ignored', 'interested']
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status"
            });
        }
        






        
        const toUser = await UserModel.findOne(toUserId);
        if (!toUser) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }


        const existingConnectionRequest = await connectionRequestModel.findOne({
            $or: [
                {
                    fromUserId: fromUserId,
                    toUserId: toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ],
            status: {
                $ne: 'ignored'
            },


        });
        if(existingConnectionRequest)
        {
            return res.status(400).json({
                message: "Request Already Sent"
            });
}
        const connectionRequest = new connectionRequestModel({
            fromUserId,
            toUserId,
            status,

        });

        const data = await connectionRequest.save();
        res.json({
            message: "Request Sent Successfully",
            data: data
        });
        

    } catch (err) {
        res.status(400).send(err.message + ' ERROR :');
    }
})





module.exports = requestRouter;
