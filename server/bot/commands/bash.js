'use strict';
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

function getBashPost(text, callback) {
  let bashArray = [];
  const randomBashId = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
  request(
    {
      url: 'http://bash.im/random',
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
      callback(bashArray[randomBashId], {});
    },
  );
}

module.exports = {
  bash: function(text, callback) {
    getBashPost(text, callback);
  },
};
