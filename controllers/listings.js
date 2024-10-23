const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find({});
        res.render('listings/index.ejs', listings);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;