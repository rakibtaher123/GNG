const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const DemoArchive = require('../models/DemoArchive');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Update all demo archives to use HTML catalogue instead of empty PDF
        const result = await DemoArchive.updateMany(
            {},
            { $set: { catalogueLink: '/files/auction-catalogue.html' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} catalogue links to HTML version`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
})();
