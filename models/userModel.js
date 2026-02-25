const { stat } = require('fs');
const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true  
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true  
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },

    //role based authentication (admin, user, etc)
    role: {
        type: String,
        enum: ['imputer', 'authorizer', 'super admin'],
    }

}, { timestamps: true  });


module.exports = mongoose.model('User', userSchema);