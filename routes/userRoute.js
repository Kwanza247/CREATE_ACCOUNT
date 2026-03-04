
const express = require('express');
const router = express.Router();
const { createAccount, loginUser, fetchAllUsers, toggleUserStatus, getById } = require('../controllers/authController');  
const { authMiddlewareInterceptor } = require('../helpers/authMiddleware');   

router.post('/register', createAccount);
router.post('/login', loginUser);
router.get("/", authMiddlewareInterceptor, fetchAllUsers);
router.get("/:id", authMiddlewareInterceptor, getById);
router.patch("/toggle-status/:id", authMiddlewareInterceptor, toggleUserStatus);

module.exports = router;

