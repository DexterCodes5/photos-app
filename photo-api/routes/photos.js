const express = require('express');
const router = express.Router();
const Photo = require("../model/Photo")

router.route('/')
    .get(async (req, res) => {
        if (!req.query.page) {
            return res.status(400).json({ 'message': "Page not specified"})
        }
        if (isNaN(req.query.page)) {
            return res.status(400).json({ 'message': "Page is not a number"})
        }
        const photos = await Photo.find()
        if (!photos)
            return res.status(204).json({ 'message': 'No Photos found.' })
        const lastIdx = req.query.page * 6
        const firstIdx = lastIdx - 6
        res.json({ 
            photos: photos.slice(firstIdx, lastIdx),
            total: photos.length
        })
    })
    .post(async (req, res) => {
        if (!req?.body?.title || !req?.body?.description || !req.body.url) {
            return res.status(400).json({ 'message': 'All required fields are not populated.' });
        }
        try {
            const result = await Photo.create({
                title: req.body.title,
                description: req.body.description,
                url: req.body.url
            })
            res.status(201).json(result)
        } catch (err) {
            console.error(err)
        }
    })

router.route("/:id")
    .get(async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Photo ID required.' });

        const photo = await Photo.findOne({ _id: req.params.id }).exec()
        if (!photo) {
            return res.status(204).json({ "message": `No photo matches ID ${req.params.id}.` });
        }
        res.json(photo)
    })
    .put(async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Photo ID required.' });

        const photo = await Photo.findOne({ _id: req.params.id }).exec()
        if (!photo) {
            return res.status(204).json({ "message": `No photo matches ID ${req.params.id}.` });
        }
        if (req.body.title) {
            photo.title = req.body.title
        }
        if (req.body.description) {
            photo.description = req.body.description
        }
        if (req.body.url) {
            photo.url = req.body.url
        }
        const result = await photo.save();
        res.json(result)
    })
    .delete(async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Photo ID required.' });
        
        const photo = await Photo.findOne({ _id: req.params.id }).exec()
        if (!photo) {
            return res.status(204).json({ "message": `No photo matches ID ${req.params.id}.` });
        }

        const result = await photo.deleteOne();
        res.json(result)
    })

module.exports = router