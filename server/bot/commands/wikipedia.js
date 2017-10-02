'use strict';
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

function getEvents(text, callback) {
  const date = new Date();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate();
  let url = `https://ru.wikipedia.org/wiki/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD:%D0%A1%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D1%8F_%D0%B4%D0%BD%D1%8F:${month}-${day}`;
  request(
    {
      url: url,
      encoding: null,
    },
    (err, res, body) => {
      const $ = cheerio.load(body);
      const quote = $('#mw-content-text ul');
      callback(
        'Cобытия дня: ' + day + '-' + month + '\n```' + quote.text() + '```',
        {},
      );
    },
  );
}

module.exports = {
  wiki: function(text, callback) {
    getEvents(text, callback);
  },
};
