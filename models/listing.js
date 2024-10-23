const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    streetAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    price: {
        type: number,
        required: true,
        min: 0,
    },
    size: {
        type: number,
        required: true,
        min: 0,
    },
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;