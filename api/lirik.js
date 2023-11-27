const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const lirikApi = async (query) => {
  try {
    const url = `https://www.google.com/search?q=lirik+lagu+${query}`;

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    await page.goto(url);

    const content = await page.content();

    const $ = cheerio.load(content);

    const lyrics = [];
    $('div[jsname="WbKHeb"] div[jsname="U8S5sf"]').each((index, element) => {
      const verse = $(element).text().trim();
      lyrics.push(verse);
    });

    const metadata = {};
    const metadataElements = $('div.rVusze');
    
    metadataElements.each((index, element) => {
      const titleElement = $(element).find('span.w8qArf');
      const valueElement = $(element).find('span.LrzXr a');

      if (titleElement.length && valueElement.length) {
        const title = titleElement.text().replace(':', '').trim();
        const value = valueElement.text().trim();

        if (title && value) {
          metadata[title] = value;
        }
      }
    });

    const imageLink = $('img[data-frt="0"]').attr('src');

    await browser.close();

    return { lyrics, metadata, imageLink };
  } catch (error) {
    throw error;
  }
};

module.exports = lirikApi;
