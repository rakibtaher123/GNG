const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DemoArchive = require('../models/DemoArchive');

const demoArchives = [
    {
        title: "AUCTION – Dhaka",
        date: "25 October 2024",
        time: "11:00 AM",
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&h=400&fit=crop",
        headerText: "Rare Coins of Bengal - October Edition",
        catalogueLink: "/files/auction-1.pdf",
        order: 1,
        realization: [
            { lot: "001", name: "Specimen 1947 Pakistan Coinage Set", price: "৳ 58,000", status: "SOLD" },
            { lot: "002", name: "Edward VII 1 Rupee 1904 (B)", price: "৳ 12,500", status: "SOLD" },
            { lot: "003", name: "Victoria Empress 1 Rupee 1882 (C)", price: "৳ 15,000", status: "SOLD" },
            { lot: "004", name: "George VI ½ Rupee 1943 (B)", price: "৳ 8,500", status: "SOLD" },
            { lot: "005", name: "British India ¼ Anna 1939", price: "---", status: "UNSOLD" },
            { lot: "006", name: "Mughal Silver Rupee - Jahangir", price: "৳ 45,000", status: "SOLD" },
            { lot: "007", name: "Akbar Gold Mohur Replica", price: "৳ 22,000", status: "SOLD" },
            { lot: "008", name: "Bengal Sultanate Tanka", price: "৳ 35,000", status: "SOLD" }
        ]
    },
    {
        title: "AUCTION – Chittagong",
        date: "18 September 2024",
        time: "2:00 PM",
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&h=400&fit=crop",
        headerText: "Historic Coins & Medals Collection",
        catalogueLink: "/files/auction-2.pdf",
        order: 2,
        realization: [
            { lot: "101", name: "Ancient Punch Marked Coin", price: "৳ 28,000", status: "SOLD" },
            { lot: "102", name: "Gupta Dynasty Gold Dinar", price: "৳ 95,000", status: "SOLD" },
            { lot: "103", name: "Indo-Greek Silver Drachm", price: "---", status: "UNSOLD" },
            { lot: "104", name: "Mauryan Empire Karshapana", price: "৳ 42,000", status: "SOLD" },
            { lot: "105", name: "Kushana Gold Coin", price: "৳ 88,000", status: "SOLD" }
        ]
    },
    {
        title: "AUCTION – Sylhet",
        date: "5 July 2024",
        time: "10:00 AM",
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&h=400&fit=crop",
        headerText: "Medieval Bengal Coins Auction",
        catalogueLink: "/files/auction-3.pdf",
        order: 3,
        realization: [
            { lot: "201", name: "Hussain Shahi Tanka", price: "৳ 38,000", status: "SOLD" },
            { lot: "202", name: "Ilyas Shahi Silver Coin", price: "৳ 32,000", status: "SOLD" },
            { lot: "203", name: "Pala Dynasty Gold Coin", price: "৳ 125,000", status: "SOLD" },
            { lot: "204", name: "Sena Dynasty Silver", price: "---", status: "UNSOLD" },
            { lot: "205", name: "Deva Dynasty Copper", price: "৳ 18,000", status: "SOLD" }
        ]
    },
    {
        title: "AUCTION – Rajshahi",
        date: "12 May 2024",
        time: "3:30 PM",
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&h=400&fit=crop",
        headerText: "Mughal Era Numismatic Collection",
        catalogueLink: "/files/auction-4.pdf",
        order: 4,
        realization: [
            { lot: "301", name: "Aurangzeb Gold Mohur", price: "৳ 185,000", status: "SOLD" },
            { lot: "302", name: "Shah Jahan Silver Rupee", price: "৳ 52,000", status: "SOLD" },
            { lot: "303", name: "Akbar Copper Dam", price: "৳ 8,500", status: "SOLD" },
            { lot: "304", name: "Jahangir Zodiac Rupee", price: "৳ 95,000", status: "SOLD" },
            { lot: "305", name: "Babur Shahrukhi", price: "---", status: "UNSOLD" },
            { lot: "306", name: "Humayun Silver Rupee", price: "৳ 48,000", status: "SOLD" }
        ]
    }
];

const seedDemoArchives = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing demo archives
        await DemoArchive.deleteMany({});
        console.log('🗑️  Cleared existing demo archives');

        // Insert new demo archives
        const result = await DemoArchive.insertMany(demoArchives);
        console.log(`✅ Successfully created ${result.length} demo archives`);

        // Display created archives
        result.forEach((archive, index) => {
            console.log(`\n${index + 1}. ${archive.title}`);
            console.log(`   Date: ${archive.date}`);
            console.log(`   Catalogue: ${archive.catalogueLink}`);
            console.log(`   Realization Items: ${archive.realization.length}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding demo archives:', error);
        process.exit(1);
    }
};

seedDemoArchives();
