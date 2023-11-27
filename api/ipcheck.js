const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

async function scrapeIPInformation(ip) {
  const url = `https://scamalytics.com/ip/${ip}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const preContent = $('pre').text().trim();
    const jsonResult = JSON.parse(preContent);

    const infoTable = $('tbody tr');

    const additionalInfo = {};
    infoTable.each((index, element) => {
      const key = $(element).find('th').text().trim();
      const value = $(element).find('td').text().trim();

      if (key === 'ISP Name') {
        additionalInfo['ISP'] = {
          name: value,
          link: $(element).find('td a').attr('href'),
        };
      } else if (key === 'Country Name') {
        additionalInfo['Location'] = {
          country: value,
          countryCode: $(element).next().find('td').text().trim(),
          region: $(element).next().next().find('td').text().trim(),
          city: $(element).next().next().next().find('td').text().trim(),
          postalCode: $(element).next().next().next().next().find('td').text().trim(),
          latitude: $(element).next().next().next().next().next().find('td').text().trim(),
          longitude: $(element).next().next().next().next().next().next().find('td').text().trim(),
        };
      } else {
        additionalInfo[key] = value;
      }
    });

    const result = { ...jsonResult, ...additionalInfo, developer: '@moe.sazumiviki' };

    return result;
  } catch (error) {
    throw error;
  }
}

router.get('/ipcheck', async (req, res) => {
  const ip = req.query.query;

  if (!ip) {
    return res.status(400).json({ error: 'IP address is required.' });
  }

  try {
    const result = await scrapeIPInformation(ip);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result, null, 2));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;