const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAdmin } = require('../middleware/auth');

// Get all categories
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM categories ORDER BY type, name';
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

// Get category by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'SELECT * FROM categories WHERE id = ?';
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
                message: 'Category not found' 
            });
        }
        
        res.json({
            success: true,
            data: results[0]
        });
    });
});

// Create category (Admin only)
router.post('/', isAdmin, (req, res) => {
    const { name, type, description } = req.body;
    
    if (!name || !type) {
        return res.status(400).json({ 
            success: false,
            message: 'Name and type are required' 
        });
    }
    
    const sql = 'INSERT INTO categories (name, type, description) VALUES (?, ?, ?)';
    db.query(sql, [name, type, description], (err, result) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                message: 'Server error', 
                error: err.message 
            });
        }
        res.status(201).json({ 
            success: true,
            message: 'Category created successfully', 
            id: result.insertId 
        });
    });
});

// Update category (Admin only)
router.put('/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { name, type, description } = req.body;
    
    if (!name || !type) {
        return res.status(400).json({ 
            success: false,
            message: 'Name and type are required' 
        });
    }
    
    const sql = 'UPDATE categories SET name = ?, type = ?, description = ? WHERE id = ?';
    db.query(sql, [name, type, description, id], (err, result) => {
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
                message: 'Category not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Category updated successfully' 
        });
    });
});

// Delete category (Admin only)
router.delete('/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM categories WHERE id = ?';
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
                message: 'Category not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Category deleted successfully' 
        });
    });
});

module.exports = router;