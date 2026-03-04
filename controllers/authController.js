const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    
const dotenv = require('dotenv');
const { fetchUserRole } = require('../helpers/authMiddleware');
const { statusTypes } = require('../models/constant');

dotenv.config();

const createAccount = async (req, res, next) => {

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
                role: user.role,
            }
        })

    }catch (error) {
        next(res.status(500).json({ message: error.message || 'Server error' }));
    }
};


// login user
const loginUser = async (req, res, next) => {
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
            role: user.role,
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
const fetchAllUsers = async (req, res, next) => {
    
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

//toggle status of user (approved, pending, rejected)
const toggleUserStatus = async (req, res, next) => {
    try {
        console.log("calling toggleUserStatus");
        const {id} = req.params;
        const { role } = req.body;
        const userRole = await fetchUserRole(req, res, next);
        console.log("userRole: ", userRole);
        if (userRole !== 'authorizer' && userRole !== 'super admin') {
            return res.status(403).json({ message: "Forbidden: You don't have permission to perform this action" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = role || user.role; 
        await user.save();  
        return res.status(200).json({ message: "Role updated successfully" });
    }catch (error) {
        next(res.status(500).json({ message: error.message || 'Server error' }));
    }
}

const getById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User fetched successfully',
            user,
        });
    }catch (error) {
        next(res.status(500).json({ message: error.message || 'Server error' }));       
    }
};

const pendingToApproved = async () => {
    try {
        const allUsers = await User.updateMany(
            {status: statusTypes.PENDING},
            {$set: {status: statusTypes.APPROVED}}
        )
        console.log("pendingToApproved cron job executed successfully: ", allUsers);
    }catch (error) {
        console.error("Error in pendingToApproved cron job: ", error);
    }
}

//write a bakground job that runs every 3am and 3pm on sundays and update user role to inputer and status back to pending
//logic 
const updateUserRoleAndStatus = async () => {
    try {
        console.log("updating user role to inputer and status to pending...");
        const result = await User.updateMany({},
            {
                $set: {
                    status:statusTypes.PENDING,
                    role: 'imputer'
                }
            }
        )
        console.log(`Updated ${result.modifiedCount} users successfully`);

    }catch(error){
        console.error("Error in updateUserRoleAndStatus cron job", error)
    }
}

module.exports = { createAccount, loginUser, fetchAllUsers, toggleUserStatus, getById, pendingToApproved, updateUserRoleAndStatus };