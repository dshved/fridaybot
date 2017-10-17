'use strict';
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const _ = require('lodash');

function getBashPost(text, callback) {
  let isYear = /\d{4}$/.test(text);
  let year;
  if (isYear && text >= 2004 && text <= 2017) {
    year = text;
  } else {
    year = _.random(2017, 2004);
  }

  let bashArray = [];
  const randomBashId = _.random(1, 50);
  request(
    {
      url: `http://bash.im/bestyear/{year}`,
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

module.exports = {
  bash: function(text, callback) {
    getBashPost(text, callback);
  },
};
