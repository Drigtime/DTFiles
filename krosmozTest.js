const req = require('request');
const cheerio = require('cheerio');

req(
  {
    method: 'GET',
    url: `http://www.krosmoz.com/fr/almanax`
  },
  (error, response, body) => {
    const $ = cheerio.load(body);
    console.log($('#almanax_boss_desc > span').text());
  }
);
