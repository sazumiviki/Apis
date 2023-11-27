const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

async function scrapeCerpen(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const cerpenList = [];

    $('h3.section-title a').each((index, element) => {
      const title = $(element).text();
      const link = $(element).attr('href');
      cerpenList.push({ title, link });
    });

    const randomCerpen = cerpenList[Math.floor(Math.random() * cerpenList.length)];
    const detailsResponse = await axios.get(randomCerpen.link);
    const details$ = cheerio.load(detailsResponse.data);

    const image = details$('img.attachment-post-thumbnail').first().attr('src');
    const author = details$('strong:contains("Oleh") a').text();
    const secondTitle = details$('p span em strong').text();
    const text = details$('p').text();

    return {
      ...randomCerpen,
      image,
      author,
      secondTitle,
      text,
    };
  } catch (error) {
    console.error('Error scraping data:', error.message);
    return {};
  }
}

router.get('/cerpen', async (req, res) => {
  const baseURL = 'https://www.bacapetra.co/cerpen';

  const randomCerpenData = await scrapeCerpen(baseURL);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(randomCerpenData, null, 2));
});

module.exports = router;