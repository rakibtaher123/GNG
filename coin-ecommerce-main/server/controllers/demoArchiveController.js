const DemoArchive = require('../models/DemoArchive');

// Get all demo archives
exports.getAllDemoArchives = async (req, res) => {
    try {
        const archives = await DemoArchive.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json(archives);
    } catch (err) {
        console.error('Get Demo Archives Error:', err);
        res.status(500).json({ error: 'Failed to fetch demo archives' });
    }
};

// Get single demo archive
exports.getDemoArchiveById = async (req, res) => {
    try {
        const archive = await DemoArchive.findById(req.params.id);
        if (!archive) {
            return res.status(404).json({ error: 'Demo archive not found' });
        }
        res.status(200).json(archive);
    } catch (err) {
        console.error('Get Demo Archive Error:', err);
        res.status(500).json({ error: 'Failed to fetch demo archive' });
    }
};

// Create new demo archive (Admin only)
exports.createDemoArchive = async (req, res) => {
    try {
        const { title, date, time, image, headerText, catalogueLink, realization, order } = req.body;

        const newArchive = new DemoArchive({
            title,
            date,
            time,
            image,
            headerText,
            catalogueLink,
            realization,
            order
        });

        await newArchive.save();
        res.status(201).json({
            message: '✅ Demo archive created successfully',
            archive: newArchive
        });
    } catch (err) {
        console.error('Create Demo Archive Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Update demo archive (Admin only)
exports.updateDemoArchive = async (req, res) => {
    try {
        const { title, date, time, image, headerText, catalogueLink, realization, order } = req.body;

        const updatedArchive = await DemoArchive.findByIdAndUpdate(
            req.params.id,
            { title, date, time, image, headerText, catalogueLink, realization, order },
            { new: true, runValidators: true }
        );

        if (!updatedArchive) {
            return res.status(404).json({ error: 'Demo archive not found' });
        }

        res.status(200).json({
            message: '✅ Demo archive updated successfully',
            archive: updatedArchive
        });
    } catch (err) {
        console.error('Update Demo Archive Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Delete demo archive (Admin only)
exports.deleteDemoArchive = async (req, res) => {
    try {
        const deletedArchive = await DemoArchive.findByIdAndDelete(req.params.id);

        if (!deletedArchive) {
            return res.status(404).json({ error: 'Demo archive not found' });
        }

        res.status(200).json({ message: '✅ Demo archive deleted successfully' });
    } catch (err) {
        console.error('Delete Demo Archive Error:', err);
        res.status(500).json({ error: 'Failed to delete demo archive' });
    }
};
