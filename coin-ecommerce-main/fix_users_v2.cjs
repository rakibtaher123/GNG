const mongoose = require('mongoose');
const User = require('./server/models/User'); // CommonJS import
require('dotenv').config({ path: './server/.env' });

const fixUsers = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            console.log(`Checking user: ${user.name}`);
            let updates = {};
            // Default values for missing fields
            if (!user.phone) updates.phone = "01712345678";
            if (!user.address) updates.address = "House 10, Road 5, Dhanmondi";
            if (!user.city) updates.city = "Dhaka";
            if (!user.postalCode) updates.postalCode = "1209";

            if (Object.keys(updates).length > 0) {
                await User.updateOne({ _id: user._id }, { $set: updates });
                console.log(`Updated user: ${user.name} (${user.email})`);
            } else {
                console.log(`User ${user.name} already has data.`);
            }
        }

        console.log('🎉 All users checked/updated!');
    } catch (err) {
        console.error("SCRIPT ERROR:", err);
    } finally {
        console.log('Closing connection...');
        await mongoose.connection.close();
        process.exit(0);
    }
};

fixUsers();
