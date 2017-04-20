'use strict';

const request = require('request');

function getHotPost(text, callback) {
  const redditUrl = 'https://www.reddit.com/r/all/top/.json?sort=top&t=day';
  request({ url: redditUrl }, (err, res, body) => {
    const json = JSON.parse(body);
    const reddits = json.data.children;
    const randomReddit =
      Math.floor(Math.random() * (reddits.length - 1 + 1)) + 1;
    if (reddits[randomReddit].data) {
      const currentReddit = reddits[randomReddit].data;
      const attachment = {};
      attachment.username = '/r/all';
      attachment.icon_emoji = ':reddit:';
      attachment.attachments = [{
        fallback: currentReddit.title,
        color: '#36a64f',
        author_name: currentReddit.author,
        title: currentReddit.title,
        title_link: currentReddit.url,
        image_url: currentReddit.url,
        thumb_url: currentReddit.thumbnail,
        fields: [{
          title: 'subreddit',
          value: currentReddit.subreddit_name_prefixed,
        }, ],
        footer: 'Made in Friday',
        footer_icon: 'http://cultofthepartyparrot.com/parrots/hd/parrot.gif',
        ts: currentReddit.created,
      }, ];
      callback('', {}, attachment);
    }
  });
}

function getJsPost(text, callback) {
  const redditUrl =
    'https://www.reddit.com/r/javascript/top/.json?sort=top&t=week';
  request({ url: redditUrl }, (err, res, body) => {
    const json = JSON.parse(body);
    const reddits = json.data.children;
    const randomReddit =
      Math.floor(Math.random() * (reddits.length - 1 + 1)) + 1;
    if (reddits[randomReddit].data) {
      const currentReddit = reddits[randomReddit].data;
      const attachment = {};
      attachment.username = '/r/javascript';
      attachment.icon_emoji = ':reddit:';
      attachment.attachments = [{
        fallback: currentReddit.title,
        color: '#36a64f',
        author_name: currentReddit.author,
        title: currentReddit.title,
        title_link: currentReddit.url,
        fields: [{
          title: 'score',
          value: currentReddit.score,
          short: false,
        }, ],
        footer: 'Made in Friday',
        footer_icon: 'http://cultofthepartyparrot.com/parrots/hd/parrot.gif',
        ts: currentReddit.created,
      }, ];
      callback('', {}, attachment);
    }
  });
}

module.exports = {
  redditHot: function(text, callback) {
    getHotPost(text, callback);
  },
  redditJs: function(text, callback) {
    getJsPost(text, callback);
  },

};
