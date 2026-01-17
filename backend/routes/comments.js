const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// --- 1. GET COMMENTS BY GALLERY ID (Detail Page) ---
router.get('/gallery/:galleryId', (req, res) => {
    const { galleryId } = req.params;
    
    const sql = `
        SELECT c.*, u.username, u.role
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.gallery_id = ?
        ORDER BY c.created_at DESC
    `;
    
    db.query(sql, [galleryId], (err, results) => {
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

// --- 2. CREATE COMMENT (Authenticated Users) ---
router.post('/', isAuthenticated, (req, res) => {
    const { gallery_id, comment_text } = req.body;
    
    if (!gallery_id || !comment_text) {
        return res.status(400).json({ 
            success: false,
            message: 'Gallery ID and comment text are required' 
        });
    }
    
    const sql = 'INSERT INTO comments (gallery_id, user_id, comment_text) VALUES (?, ?, ?)';
    
    db.query(sql, [gallery_id, req.session.user.id, comment_text], (err, result) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                message: 'Server error', 
                error: err.message 
            });
        }
        res.status(201).json({ 
            success: true,
            message: 'Comment posted successfully', 
            id: result.insertId 
        });
    });
});

// --- 3. DELETE COMMENT (Owner or Admin) ---
router.delete('/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    
    // Check if user is admin or comment owner
    const checkSql = 'SELECT user_id FROM comments WHERE id = ?';
    db.query(checkSql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                message: 'Server error', 
                error: err.message 
            });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Comment not found' 
            });
        }
        
        const comment = results[0];
        
        if (req.session.user.role === 'admin' || req.session.user.id === comment.user_id) {
            const deleteSql = 'DELETE FROM comments WHERE id = ?';
            db.query(deleteSql, [id], (err, result) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false,
                        message: 'Server error', 
                        error: err.message 
                    });
                }
                res.json({ 
                    success: true,
                    message: 'Comment deleted successfully' 
                });
            });
        } else {
            res.status(403).json({ 
                success: false,
                message: 'Forbidden. You can only delete your own comments' 
            });
        }
    });
});

// --- 4. GET ALL COMMENTS (Admin Only - Buat Tab Management) ---
router.get('/all', isAuthenticated, (req, res) => {
    // Pastikan yang akses cuma Admin
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Admin only.' 
        });
    }

    // Join comment, user, dan gallery biar admin tau komen di gambar apa
    const sql = `
        SELECT 
            c.id, 
            c.comment_text, 
            c.created_at,
            u.username,
            g.title as gallery_title,
            g.id as gallery_id
        FROM comments c
        JOIN users u ON c.user_id = u.id
        JOIN galleries g ON c.gallery_id = g.id
        ORDER BY c.created_at DESC
    `;
    
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

module.exports = router;