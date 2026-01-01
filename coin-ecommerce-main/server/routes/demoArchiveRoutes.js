const express = require('express');
const router = express.Router();
const demoArchiveController = require('../controllers/demoArchiveController');
const jwt = require('jsonwebtoken');

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Public routes
router.get('/', demoArchiveController.getAllDemoArchives);
router.get('/:id', demoArchiveController.getDemoArchiveById);

// Admin protected routes
router.post('/', verifyAdmin, demoArchiveController.createDemoArchive);
router.put('/:id', verifyAdmin, demoArchiveController.updateDemoArchive);
router.delete('/:id', verifyAdmin, demoArchiveController.deleteDemoArchive);

module.exports = router;
