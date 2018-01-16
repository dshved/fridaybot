const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const _ = require('lodash');

function getBashPost(text, callback) {
  const isYear = /\d{4}$/.test(text);
  const currentYear = new Date().getFullYear();
  let year;
  if (isYear && text >= 2004 && text <= currentYear) {
    year = text;
  } else {
    year = _.random(currentYear, 2004);
  }

  const bashArray = [];
  const randomBashId = _.random(1, 50);
  const randomMonth = _.random(1, 12);
  request(
    {
      url: `http://bash.im/bestyear/${year}/${randomMonth}`,
      encoding: null,
    },
    (err, res, body) => {
      const $ = cheerio.load(iconv.decode(body, 'cp1251'), {
        decodeEntities: false,
      });

      const quote = $('#body > .quote > .text');

      quote.each((i, post) => {
        bashArray[i] = $(post)
          .html()
          .replace(/<br>/g, '\n')
          .replace(/&quot;/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      });
      callback(`${year} год\n ${bashArray[randomBashId]}`, {});
    },
  );
}

module.exports = getBashPost;
