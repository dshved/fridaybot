const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');
const { random } = require('lodash');

function getRandomComic(text, callback) {
  const randomComic = random(1000, 4650);
  const randomValue = random(1);

  const url = randomValue
    ? `http://explosm.net/comics/${randomComic}/`
    : 'http://explosm.net/rcg/';

  request(
    {
      url,
      encoding: null,
    },
    (err, res, body) => {
      const $ = cheerio.load(iconv.decode(body, 'utf-8'), {
        decodeEntities: false,
      });
      const image = randomValue ? $('#main-comic') : $('#rcg-comic img');
      let imageSrc = image.attr('src');

      const attachment = {};
      attachment.username = 'fridaybot';
      attachment.icon_emoji = ':fridaybot_new:';
      if (imageSrc) {
        imageSrc = imageSrc.substr(2);
        attachment.attachments = [
          {
            fallback: 'Random Comic',
            color: '#36a64f',
            title: 'Random Comic',
            image_url: `http://${imageSrc}`,
          },
        ];
        callback('', {}, attachment);
      }
    },
  );
}

module.exports = {
  randomComic: (text, callback) => {
    getRandomComic(text, callback);
  },
};
