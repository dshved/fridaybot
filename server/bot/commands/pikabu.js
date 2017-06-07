'use strict';

const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');




function getPost(section, callback) {
  request({
      url: `http://pikabu.ru/${section}`,
      encoding: null,
    },
    (err, res, body) => {
      const $ = cheerio.load(iconv.decode(body, 'cp1251'), {
        decodeEntities: false,
      });
      const stories = $('.story');
      const storiesArray = [];
      stories.each((i, story) => {

        storiesArray.push({
          rating: $('.story__rating-count', story).text().trim(),
          title: $('.story__title-link', story).text(),
          link: $('.story__title-link', story).attr('href'),
          text: $('.b-story-block__content', story)
            .text()
            .replace(/\t/g, '')
            .replace(/\n\n/g, ''),
          img_1: $('.b-story-block.b-story-block_type_image > .b-story-block__content > a > img', story).attr('src'),
          img_2: $('.b-story__content.b-story__content_type_media > a > img', story).attr('src'),
          gif: $('.b-gifx__state.b-gifx__state_playing_yes.b-gifx__save', story).attr('href'),
        })
      });
      const randomPost = Math.floor(Math.random() * (storiesArray.length - 1 + 1)) + 1;
      const currentPost = storiesArray[randomPost];
      const attachment = {};
      console.log(currentPost);

      function currentAttachment(post) {
        if (post.img_1) {
          return post.img_1;
        } else if (post.img_2) {
          return post.img_2;
        } else if (post.gif) {
          return post.gif;
        }
        return post.img_1;
      }
      attachment.username = `Pikabu/${section}`;
      attachment.icon_emoji = ':pikabu:';
      attachment.attachments = [{
        fallback: currentPost.title,
        color: '#36a64f',
        author_name: currentPost.author,
        title: currentPost.title,
        text: currentPost.text,
        title_link: currentPost.link,
        image_url: currentAttachment(currentPost),
        fields: [{
          title: 'rating',
          value: currentPost.rating,
          short: false,
        }, ],
        footer: 'Made in Friday',
        footer_icon: 'http://cultofthepartyparrot.com/parrots/hd/parrot.gif',
        ts: currentPost.created,
      }, ];
      callback('', {}, attachment);
    }
  );
}

module.exports = {
  pikabuHot: (text, callback, msg) => {
    getPost('hot', callback);
  },
  pikabuBest: (text, callback, msg) => {
    getPost('best', callback);
  },
  pikabuNew: (text, callback, msg) => {
    getPost('new', callback);
  },
};
