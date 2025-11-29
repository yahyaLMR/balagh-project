const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Complaint = require('../models/complaint');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

const upload = multer({ storage: storage });

// Create a new complaint
router.post('/complaints', upload.array('images', 3), async (req, res) => {
    const { title, description } = req.body;
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'At least one image is required' });
    }

    const imagePaths = req.files.map(file => file.path);

    try {
        const newComplaint = new Complaint({ 
            title, 
            description,
            images: imagePaths
        });
        const savedComplaint = await newComplaint.save();
        res.status(201).json(savedComplaint);
    }   catch (error) {
        res.status(500).json({ error: 'Failed to create complaint' });
    }
});

// Get all complaints
router.get('/complaints', 
    authenticateToken, 
    async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch complaints' });
    }
});

// Delete a complaint by ID
router.delete('/complaints/:id', authenticateToken, async (req, res) => {
    const complaintId = req.params.id;
    try {
        const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);
        if (deletedComplaint) {
            res.json({ message: 'Complaint deleted successfully' });
        } else {
            res.status(404).json({ error: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete complaint' });
    }
});

// Update complaint status by ID
router.put('/complaints/:id/status', authenticateToken, async (req, res) => {
    const complaintId = req.params.id;
    const { status } = req.body;
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { status },
            { new: true }
        );
        if (updatedComplaint) {
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ error: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update complaint status' });
    }
});

module.exports = router;