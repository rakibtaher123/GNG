const mongoose = require('mongoose');

const demoArchiveSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        required: true
    },
    headerText: {
        type: String,
        default: ''
    },
    catalogueLink: {
        type: String,
        default: ''
    },
    realization: [{
        lot: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['SOLD', 'UNSOLD'],
            default: 'SOLD'
        }
    }],
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DemoArchive', demoArchiveSchema);
