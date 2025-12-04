const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { isAdmin } = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|jfif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// Get all galleries
router.get('/', (req, res) => {
    const { category_id } = req.query;
    
    let sql = `
        SELECT g.*, c.name as category_name, c.type as category_type, u.username 
        FROM galleries g
        JOIN categories c ON g.category_id = c.id
        JOIN users u ON g.user_id = u.id
    `;
    
    const params = [];
    
    if (category_id) {
        sql += ' WHERE g.category_id = ?';
        params.push(category_id);
    }
    
    sql += ' ORDER BY g.created_at DESC';
    
    db.query(sql, params, (err, results) => {
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

// Get single gallery
router.get('/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = `
        SELECT g.*, c.name as category_name, c.type as category_type, u.username 
        FROM galleries g
        JOIN categories c ON g.category_id = c.id
        JOIN users u ON g.user_id = u.id
        WHERE g.id = ?
    `;
    
    db.query(sql, [id], (err, results) => {
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
                message: 'Gallery not found' 
            });
        }
        
        res.json({
            success: true,
            data: results[0]
        });
    });
});

// Create gallery (Admin only)
router.post('/', isAdmin, upload.single('image'), (req, res) => {
    const { category_id, title, car_model, driver_name, description } = req.body;
    
    if (!category_id || !title) {
        return res.status(400).json({ 
            success: false,
            message: 'Category and title are required' 
        });
    }
    
    if (!req.file) {
        return res.status(400).json({ 
            success: false,
            message: 'Image is required' 
        });
    }
    
    const image_path = `/uploads/${req.file.filename}`;
    
    const sql = 'INSERT INTO galleries (category_id, title, car_model, driver_name, description, image_path, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [category_id, title, car_model, driver_name, description, image_path, req.session.user.id], (err, result) => {
        if (err) {
            // Delete uploaded file if database insert fails
            fs.unlinkSync(`uploads/${req.file.filename}`);
            return res.status(500).json({ 
                success: false,
                message: 'Server error', 
                error: err.message 
            });
        }
        res.status(201).json({ 
            success: true,
            message: 'Gallery created successfully', 
            id: result.insertId 
        });
    });
});

// Update gallery (Admin only)
router.put('/:id', isAdmin, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { category_id, title, car_model, driver_name, description } = req.body;
    
    if (!category_id || !title) {
        return res.status(400).json({ 
            success: false,
            message: 'Category and title are required' 
        });
    }
    
    let sql = 'UPDATE galleries SET category_id = ?, title = ?, car_model = ?, driver_name = ?, description = ?';
    let params = [category_id, title, car_model, driver_name, description];
    
    if (req.file) {
        // Delete old image
        const getSql = 'SELECT image_path FROM galleries WHERE id = ?';
        db.query(getSql, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    message: 'Server error', 
                    error: err.message 
                });
            }
            
            if (results.length > 0 && results[0].image_path) {
                const oldImagePath = results[0].image_path.replace('/uploads/', 'uploads/');
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        });
        
        sql += ', image_path = ?';
        params.push(`/uploads/${req.file.filename}`);
    }
    
    sql += ' WHERE id = ?';
    params.push(id);
    
    db.query(sql, params, (err, result) => {
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
                message: 'Gallery not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Gallery updated successfully' 
        });
    });
});

// Delete gallery (Admin only)
router.delete('/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    
    // Get image path before deleting
    const getSql = 'SELECT image_path FROM galleries WHERE id = ?';
    db.query(getSql, [id], (err, results) => {
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
                message: 'Gallery not found' 
            });
        }
        
        const imagePath = results[0].image_path.replace('/uploads/', 'uploads/');
        
        // Delete from database
        const deleteSql = 'DELETE FROM galleries WHERE id = ?';
        db.query(deleteSql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    message: 'Server error', 
                    error: err.message 
                });
            }
            
            // Delete image file
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            
            res.json({ 
                success: true,
                message: 'Gallery deleted successfully' 
            });
        });
    });
});

module.exports = router;