
const express = require('express');
const router = express.Router();
const { createAccount, loginUser, fetchAllUsers, filterUsersByStatus } = require('../controllers/authController');  
const { authMiddlewareInterceptor } = require('../helpers/authMiddleware');   

router.post('/register', createAccount);
router.post('/login', loginUser);
router.get("/", authMiddlewareInterceptor, fetchAllUsers);

module.exports = router;

