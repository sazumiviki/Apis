const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

async function scrapeFakexy() {
  try {
    const response = await axios.get('https://www.fakexy.com/');
    const $ = cheerio.load(response.data);

    const getInfo = (selector) => {
      const info = {};
      $(selector).each((index, element) => {
        const label = $(element).find('td:first-child').text().trim();
        const value = $(element).find('td:last-child').text().trim();
        info[label] = value;
      });
      return info;
    };

    const addressInfo = getInfo('.box-title:contains("US address generator") ~ table tbody tr');
    const personInfo = getInfo('.box-title:contains("Matched person profile") ~ table tbody tr');
    const creditCardInfo = getInfo('.box-title:contains("Finance & Credit Card infomation") ~ table tbody tr');

    return [addressInfo, personInfo, creditCardInfo];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

router.get('/fakexy', async (req, res) => {
  try {
    const result = await scrapeFakexy();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result, null, 2));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;