const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config({ path: './server/.env' });

const fixUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            let updates = {};
            if (!user.phone) updates.phone = "01712345678";
            if (!user.address) updates.address = "House 10, Road 5, Dhanmondi";
            if (!user.city) updates.city = "Dhaka";
            if (!user.postalCode) updates.postalCode = "1209";

            if (Object.keys(updates).length > 0) {
                await User.updateOne({ _id: user._id }, { $set: updates });
                console.log(`Updated user: ${user.name} (${user.email})`);
            }
        }

        console.log('🎉 All users updated!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixUsers();
