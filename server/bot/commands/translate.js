const axios = require('axios');
const querystring = require('querystring');

function getTranslate(text, callback) {
  const obj = {
    id: '2ca2a77c.5a954e9d.6d8d9a63-1-0',
    srv: 'tr-text',
    lang: 'ru-emj',
    reason: 'auto',
    text,
  };
  const url = `https://translate.yandex.net/api/v1/tr.json/translate?${querystring.stringify(
    obj,
  )}`;

  axios.get(url).then(({ data }) => callback(data.text.join(''), {}));
}

module.exports = {
  getTranslate: (text, callback) => {
    getTranslate(text, callback);
  },
};
