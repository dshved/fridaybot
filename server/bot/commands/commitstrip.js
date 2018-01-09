const request = require('request');
const cheerio = require('cheerio');

function getCommitstripPost(text, callback) {
  request(
    {
      url: 'http://www.commitstrip.com/?random=1',
      encoding: null,
    },
    (err, res, body) => {
      const $ = cheerio.load(body, {
        decodeEntities: false,
      });
      const title = $('.entry-title').html();
      const imgUrl = $('.entry-content img').attr('src');
      const attachment = {};
      attachment.username = 'CommitStrip';
      attachment.icon_emoji = ':commitstrip:';
      attachment.attachments = [
        {
          fallback: title,
          color: '#36a64f',
          title,
          image_url: imgUrl,
        },
      ];
      callback('', {}, attachment);
    },
  );
}

module.exports = getCommitstripPost;
