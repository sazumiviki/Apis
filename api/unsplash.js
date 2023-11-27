const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/unsplash', async (req, res) => {
    try {
        const query = req.query.query;
        const url = `https://unsplash.com/s/photos/${query}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const imageLinks = [];

        $('img').each((i, elem) => {
            imageLinks.push($(elem).attr('src'));
        });

        const jsonResponse = {
            status: true,
            instagram: '@moe.sazumiviki',
            media: 'Unsplash',
            result: imageLinks
        };

        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(jsonResponse, null, 2));
    } catch (error) {
        console.log('Error fetching images:', error);
        res.status(500).json({
            status: false,
            instagram: '@moe.sazumiviki',
            media: 'Unsplash',
            result: 'Error fetching images'
        });
    }
});

module.exports = router;