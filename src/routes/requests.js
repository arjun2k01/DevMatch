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


requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => { 
    try {
        const loggedInUser = req.user;
        const {status,requestId
    } = req.params.status;

        const allowedStatus = ['accepted', 'rejected']
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status"
            });
        }

        const connectionRequest = await connectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if (!connectionRequest) { 
            return res.status(404).json({
                message: "ConnectionRequest Not Found"
            });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: `
            Connection Request ${status} Successfully`,
            data: data
        });




    } catch (error) {
        
        res.status(400).json({
            message: error.message
            });
    }
})






module.exports = requestRouter;
