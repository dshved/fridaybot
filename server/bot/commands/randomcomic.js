const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');

function getRandomComic(text, callback) {
  request(
    {
      url: `http://explosm.net/rcg`,
      encoding: null,
    },
    (err, res, body) => {
      const $ = cheerio.load(iconv.decode(body, 'utf-8'), {
        decodeEntities: false,
      });
      const image = $('#rcg_image');
      const imageSrc = image.attr('value');
      const attachment = {};
      attachment.username = `Fridaybot`;
      attachment.icon_emoji = ':fbf:';
      if (imageSrc) {
        attachment.attachments = [
          {
            fallback: 'Random Comic',
            color: '#36a64f',
            title: 'Random Comic',
            image_url: imageSrc,
          },
        ];
        callback('', {}, attachment);
      }
    },
  );
}

module.exports = {
  randomComic: (text, callback, msg) => {
    getRandomComic(text, callback);
  },
};
