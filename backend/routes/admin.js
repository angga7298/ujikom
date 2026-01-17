const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// --- Middleware Cek Admin ---
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
// ---------------------------------

// GET /api/admin/stats
// Endpoint ini dipanggil sama AdminDashboard buat ngisi tab Stats
router.get('/stats', isAuthenticated, isAdmin, (req, res) => {
    // Kita query semua count secara paralel biar cepet
    const countGalleries = new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM galleries', (err, result) => {
            if (err) reject(err);
            else resolve(result[0].count);
        });
    });

    const countCategories = new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM categories', (err, result) => {
            if (err) reject(err);
            else resolve(result[0].count);
        });
    });

    const countUsers = new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM users', (err, result) => {
            if (err) reject(err);
            else resolve(result[0].count);
        });
    });

    const countComments = new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM comments', (err, result) => {
            if (err) reject(err);
            else resolve(result[0].count);
        });
    });

    // Jalankan semua query bareng-bareng
    Promise.all([countGalleries, countCategories, countUsers, countComments])
        .then(([galleries, categories, users, comments]) => {
            res.json({
                success: true,
                data: {
                    totalGalleries: galleries,
                    totalCategories: categories,
                    totalUsers: users,
                    totalComments: comments
                }
            });
        })
        .catch((err) => {
            console.error('Stats fetch error:', err);
            res.status(500).json({ 
                success: false, 
                message: 'Server error fetching stats',
                error: err.message 
            });
        });
});

module.exports = router;