const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');

// --- Middleware Sederhana Cek Admin ---
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            success: false,
            message: 'Access denied. Admin only.' 
        });
    }
};
// -------------------------------------

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
        
        // Save session before sending response
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
            }
            res.json({
                success: true,
                message: 'Login successful',
                user: req.session.user
            });
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

// UPDATE PROFILE
router.put('/profile', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized' 
            });
        }

        const userId = req.session.user.id;
        const { username, email, current_password, new_password } = req.body;

        // Validasi minimal ada sesuatu yang diupdate
        if (!username && !new_password && !email) {
            return res.status(400).json({
                success: false,
                message: 'No data to update'
            });
        }

        // 1. Ambil data user saat ini dari database
        const getUserSql = 'SELECT * FROM users WHERE id = ?';
        const users = await new Promise((resolve, reject) => {
            db.query(getUserSql, [userId], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const user = users[0];
        let updateFields = [];
        let params = [];
        let hasChanges = false;

        // 2. Cek username jika diubah
        if (username && username !== user.username) {
            // Cek duplikasi username
            const checkUsernameSql = 'SELECT id FROM users WHERE username = ? AND id != ?';
            const duplicateUsers = await new Promise((resolve, reject) => {
                db.query(checkUsernameSql, [username, userId], (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });

            if (duplicateUsers.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Username already taken' 
                });
            }

            updateFields.push('username = ?');
            params.push(username);
            req.session.user.username = username;
            hasChanges = true;
        }

        // 3. Cek email jika diubah
        if (email && email !== user.email) {
            // Cek duplikasi email
            const checkEmailSql = 'SELECT id FROM users WHERE email = ? AND id != ?';
            const duplicateEmails = await new Promise((resolve, reject) => {
                db.query(checkEmailSql, [email, userId], (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });

            if (duplicateEmails.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email already in use' 
                });
            }

            updateFields.push('email = ?');
            params.push(email);
            req.session.user.email = email;
            hasChanges = true;
        }

        // 4. Cek password jika diubah
        if (new_password) {
            if (!current_password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Current password is required to change password' 
                });
            }

            // Verifikasi password saat ini
            const isMatch = await bcrypt.compare(current_password, user.password);
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Current password is incorrect' 
                });
            }

            // Hash password baru
            const hashedPassword = await bcrypt.hash(new_password, 10);
            updateFields.push('password = ?');
            params.push(hashedPassword);
            hasChanges = true;
        }

        // 5. Jika ada perubahan, eksekusi update
        if (hasChanges) {
            params.push(userId);
            const updateSql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
            
            await new Promise((resolve, reject) => {
                db.query(updateSql, params, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });

            // Simpan session
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to save session'
                    });
                }
                
                res.json({ 
                    success: true, 
                    message: 'Profile updated successfully',
                    user: req.session.user
                });
            });
        } else {
            res.json({ 
                success: true, 
                message: 'No changes detected',
                user: req.session.user
            });
        }

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// --- ROUTES BARU UNTUK ADMIN DASHBOARD ---

// 1. GET ALL USERS (Hanya Admin)
router.get('/users', isAdmin, (req, res) => {
    const sql = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: err.message 
            });
        }
        res.json({ 
            success: true, 
            data: results 
        });
    });
});

// 2. TOGGLE/UPDATE ROLE (Hanya Admin)
router.put('/user/:id/role', isAdmin, (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // 'user' atau 'admin'

    // Validasi input role
    if (!role || (role !== 'user' && role !== 'admin')) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid role specified' 
        });
    }

    // Cegah admin mengubah role dirinya sendiri (opsional, tapi disarankan)
    if (parseInt(id) === req.session.user.id) {
        return res.status(400).json({ 
            success: false, 
            message: 'You cannot change your own role' 
        });
    }

    const sql = 'UPDATE users SET role = ? WHERE id = ?';
    
    db.query(sql, [role, id], (err, result) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: err.message 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            message: `User role updated to ${role}` 
        });
    });
});

// 3. DELETE USER (Hanya Admin)
router.delete('/user/:id', isAdmin, (req, res) => {
    const { id } = req.params;

    // Cegah admin menghapus dirinya sendiri
    if (parseInt(id) === req.session.user.id) {
        return res.status(400).json({ 
            success: false, 
            message: 'You cannot delete your own account' 
        });
    }

    const sql = 'DELETE FROM users WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: err.message 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'User deleted successfully' 
        });
    });
});

module.exports = router;