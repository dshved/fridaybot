const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');

var j = request.jar();
var cookie = request.cookie('entriesOnPage=20;types=gif');
var url = 'https://developerslife.ru/';
j.setCookie(cookie, url);

function getEntries(url, cb) {
  request(
    {
      url: `https://developerslife.ru/${url}`,
      encoding: null,
      jar: j,
    },
    (err, res, body) => {
      const $ = cheerio.load(iconv.decode(body, 'utf-8'), {
        decodeEntities: false,
      });
      const entryes = $('.entry');
      let array = [];
      entryes.each((i, entry) => {
        array.push({
          img: $('backup_img', entry).attr('src'),
          value: $('.value', entry).text(),
        });
      });
      cb(array);
    },
  );
}

function getEntry(section, array, callback) {
  const attachment = {};
  attachment.username = `DevLife/${section}`;
  attachment.icon_emoji = ':devlife:';

  if (array.length) {
    const randomPost = Math.floor(Math.random() * array.length);
    const currentPost = array[randomPost];

    attachment.attachments = [
      {
        fallback: currentPost.value,
        color: '#36a64f',
        title: currentPost.value,
        image_url: `http:${currentPost.img}`,
      },
    ];
    callback('', {}, attachment);
  } else {
    callback('По данному запросу ничего не найдено(', {}, attachment);
  }
}

function getRandomEntry(text, callback) {
  getEntries('random', array => {
    getEntry('random', array, callback);
  });
}

function getMonthlyEntry(text, callback) {
  getEntries('monthly/0', array => {
    getEntry('monthly', array, callback);
  });
}

function getSearchEntry(text, callback) {
  if (text !== 'RANDOM' && text !== 'HOT') {
    let searchText = encodeURIComponent(text);
    getEntries(`search?x=0&y=0&phrase=${searchText}`, array => {
      getEntry(text, array, callback);
    });
  }
}

module.exports = {
  devlifeSearch: (text, callback, msg) => {
    getSearchEntry(text, callback);
  },
  devlifeRandom: (text, callback, msg) => {
    getRandomEntry(text, callback);
  },
  devlifeHot: (text, callback, msg) => {
    getMonthlyEntry(text, callback);
  },
};
