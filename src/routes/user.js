const express = require('express');
const userAuth = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const UserModel = require('../models/user');
const userRouter = express.Router();





userRouter.get('/user/requests/recieved',userAuth,async (req, res) => { 

    try {


        const loggedInUser = req.user;

        const conectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', ['firstName',
            'lastName', 'photoUrl'
            ,'age','gender','about'
        ]);

        
        res.status(200).json({
            message: 'Connection requests',
            data: conectionRequest
        });
        
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
})
userRouter.get('/user/connections', userAuth, async (req, res) => { 
    try {
        
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: 'accepted' },
                { fromUserId: loggedInUser._id, status: 'accepted' },
            ]
        });

        res.json({
            message: 'Connections',
            data: connectionRequests
        }).populate('fromUserId',
            'firstName lastName photoUrl age gender about'
        ).populate('toUserId',
            'firstName lastName photoUrl age gender about'
        )

        const data = connectionRequests.map((row) => {
            if (row.fromUserId.toString()===loggedInUser._id) {
                return row.toUserId
            }
            return row.fromUserId
        })
        




    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
})



userRouter.get('/feed', userAuth, async (req, res) => { 
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                {
                    fromUserId: loggedInUser._id,
                },
                {
                    toUserId: loggedInUser._id,
                }
            ]

        }).select('fromUserId toUserId')


        const hideUsersFromFeed = new Set()
        connectionRequests.forEach(request => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        
        });

        const users = await UserModel.find({
            $and: [
                { _id: { $nin: [...hideUsersFromFeed] } },
                { _id: { $ne: loggedInUser._id } }
            ]
            }).select('firstName lastName photoUrl age gender about')
        




res.json({
            message: 'Feed',
            data: users
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = userRouter;
