const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

router.get('/', async (req, res) => {
    try {
        const populatedListings = await Listing.find({}).populate('owner');
        res.render('listings/index.ejs', { listings: populatedListings });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});


router.post('/', async (req, res) => {
    try {
        const formData = req.body;

        formData.owner = req.session.user._id;

        await Listing.create(formData);

        res.redirect('/listings');
    } catch (error) {
        res.send(error)
    }
});

router.get('/:listingId', async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const listing = await Listing.findById(listingId).populate('owner');

        const userHasFavorited = listing.favoritedByUsers.some((user) =>
            user.equals(req.session.user._id)
        );

        res.render('listings/show.ejs', { listing, userHasFavorited: userHasFavorited, })
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.delete('/:listingId', async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const listing = await Listing.findById(listingId);
        if (listing.owner.equals(req.session.user._id)) {
            await listing.deleteOne();
            res.redirect('/listings');
        } else {
            res.send("You don't have permission to do that");
        }

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:listingId/edit', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);
        res.render('listings/edit.ejs', { listing });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.put('/:listingId', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);
        if (listing.owner.equals(req.session.user._id)) {
            await listing.updateOne(req.body)
            res.redirect('/listings')
        } else {
            res.send("You don't have permission to do that.");
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.post('/:listingId/favorited-by/:userId', async (req, res) => {
    try {
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $push: { favoritedByUsers: req.params.userId },
        });
        res.redirect(`/listings/${req.params.listingId}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.delete('/:listingId/favorited-by/:userId', async (req, res) => {
    try {
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: { favoritedByUsers: req.params.userId },
        });
        res.redirect(`/listings/${req.params.listingId}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;