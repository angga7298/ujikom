// Middleware untuk cek apakah user sudah login
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ 
            success: false,
            message: 'Unauthorized. Please login first.' 
        });
    }
};

// Middleware untuk cek apakah user adalah admin
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            success: false,
            message: 'Forbidden. Admin access only.' 
        });
    }
};

module.exports = { isAuthenticated, isAdmin };