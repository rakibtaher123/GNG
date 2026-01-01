const express = require("express");
const router = express.Router();
const Auction = require("../models/Auction");
const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// ⚠️ IMPORTANT: This route MUST come BEFORE /:auctionId 
// Otherwise, Express will interpret "user" as an auctionId!
// Get bid history for the authenticated user
router.get("/user/me", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // From JWT token

        // Find all auctions where user has placed bids
        // Query matches 'bids.user' which is ObjectId (how bids are stored)
        const auctions = await Auction.find({
            "bids.user": userId
        }).populate('bids.user', 'name email');

        const userBids = [];

        auctions.forEach(auction => {
            const bids = auction.bids.filter(bid =>
                bid.user && bid.user._id && bid.user._id.toString() === userId
            );
            bids.forEach(bid => {
                userBids.push({
                    auctionId: auction._id,
                    productName: auction.productName,
                    productImage: auction.productImage,
                    category: auction.category,
                    bidAmount: bid.amount,
                    timestamp: bid.time || bid.timestamp,
                    isWinning: auction.highestBidder && auction.highestBidder.toString() === userId,
                    auctionStatus: auction.status,
                    auctionEndTime: auction.endTime
                });
            });
        });

        // Sort by timestamp (newest first)
        userBids.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json({
            userId: userId,
            totalBids: userBids.length,
            bids: userBids
        });

    } catch (error) {
        console.error("❌ Error fetching user bid history:", error);
        res.status(500).json({ message: error.message });
    }
});

// Place a bid on an auction
router.post("/:auctionId", async (req, res) => {
    try {
        const { auctionId } = req.params;
        const { amount, userEmail, userName } = req.body;

        // Validation
        if (!amount || !userEmail) {
            return res.status(400).json({ message: "Amount and user email are required" });
        }

        // Find auction
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // Check if auction is live
        if (auction.status !== "Live") {
            return res.status(400).json({ message: "Auction is not currently live" });
        }

        // Check if auction has ended
        const now = new Date();
        if (now > new Date(auction.endTime)) {
            return res.status(400).json({ message: "Auction has ended" });
        }

        // Check minimum bid
        const currentHighest = auction.highestBid || auction.basePrice;
        const minIncrement = Math.max(Math.ceil(currentHighest * 0.05), 500);
        const minBid = currentHighest + minIncrement;

        if (amount < minBid) {
            return res.status(400).json({
                message: `Bid must be at least ৳${minBid.toLocaleString()}`,
                minBid: minBid
            });
        }

        // Create bid object
        const newBid = {
            userEmail: userEmail,
            userName: userName || userEmail.split('@')[0],
            amount: amount,
            timestamp: new Date()
        };

        // Add bid to auction
        auction.bids.push(newBid);
        auction.highestBid = amount;
        auction.totalBids = auction.bids.length;

        await auction.save();

        console.log(`✅ New bid placed: ${userEmail} bid ৳${amount.toLocaleString()} on "${auction.productName}"`);

        res.status(201).json({
            message: "Bid placed successfully",
            auction: auction,
            bid: newBid
        });

    } catch (error) {
        console.error("❌ Error placing bid:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get all bids for an auction
router.get("/:auctionId", async (req, res) => {
    try {
        const { auctionId } = req.params;

        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // Return bids sorted by timestamp (newest first)
        const sortedBids = auction.bids.sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        res.json({
            auctionId: auction._id,
            productName: auction.productName,
            totalBids: auction.totalBids,
            highestBid: auction.highestBid,
            bids: sortedBids
        });

    } catch (error) {
        console.error("❌ Error fetching bids:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

