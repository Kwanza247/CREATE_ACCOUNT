const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    
const dotenv = require('dotenv');


exports.createAccount = async (req, res, next) => {

    try {
        const {
            email,
            password,
            phoneNumber,
            fullName,
            role,
        } = req.body;
        // Convert email to lowercase
        const lowerEmail = email.toLowerCase();

        //read on password rule(e.g must contain letter, certain number)
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email: lowerEmail }, { phoneNumber }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // salt and hash the password || argon hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const user = await User.create({
            email,
            password: hashedPassword,
            phoneNumber,
            fullName,
            role
        });
    
        res.status(201).json({
            message: `Account created successfully for ${user.email}`,
            user: {
                email: user.email,
                phoneNumber: user.phoneNumber,
                fullName: user.fullName,
            }
        })

    }catch (error) {
        next(res.status(500).json({ message: error.message || 'Server error' }));
    }
};


// login user
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //email to lowercase
        const lowerEmail = email.toLowerCase();

        // Check if user exists
        const user = await User.findOne({ email: lowerEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'incorrect password' });
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
        }, process.env.JWT_SECRET, 
        { expiresIn: '1h' });
        res.status(200).json({
            message: `Login successful for ${user.email}`,
            token,
            role: user.role,
            fullName: user.fullName,
        });
    }catch (error) {
       next(res.status(500).json({ message: error.message || 'Server error' }));
    }
}


//fetch all users and also filter by status (approved, pending, rejected)
exports.fetchAllUsers = async (req, res, next) => {
    
    try {
        const { status } = req.query;
        console.log("status: ", status);
        if(status) {
                if (!['approved', 'pending', 'rejected'].includes(status)) {
                return res.status(400).json({ message: `${status} is not a valid status value` });
            }
            const searchedStatus = await User.find({ status }).select('-password');
            res.status(200).json({
                message: status?`Users with status ${status} fetched successfully`:'Users fetched successfully',
                users: searchedStatus,
            });
        }else {
            const users = await User.find().select('-password'); // Exclude password field
            res.status(200).json({
                message: 'Users fetched successfully',
                users,
            });
        }
    }catch (error) {
        next(res.status(500).json({ message: error.message || 'Server error' }));
    }
};
