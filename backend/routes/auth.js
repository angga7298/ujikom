const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'All fields are required' 
        });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [username, email, hashedPassword, 'user'], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false,
                        message: 'Username or email already exists' 
                    });
                }
                return res.status(500).json({ 
                    success: false,
                    message: 'Server error', 
                    error: err.message 
                });
            }
            res.status(201).json({ 
                success: true,
                message: 'User registered successfully' 
            });
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Username and password are required' 
        });
    }
    
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                message: 'Server error', 
                error: err.message 
            });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }
        
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }
        
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        res.json({
            success: true,
            message: 'Login successful',
            user: req.session.user
        });
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                message: 'Logout failed' 
            });
        }
        res.clearCookie(process.env.SESSION_NAME || 'rally_session');
        res.json({ 
            success: true,
            message: 'Logout successful' 
        });
    });
});

// Check session
router.get('/check', (req, res) => {
    if (req.session.user) {
        res.json({ 
            success: true,
            authenticated: true, 
            user: req.session.user 
        });
    } else {
        res.json({ 
            success: true,
            authenticated: false 
        });
    }
});

module.exports = router;