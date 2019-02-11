const axios = require('axios');
const querystring = require('querystring');

function getTranslate(text, callback) {
  const obj = {
    id: 'a60d024c.5c6135fd.77b5ec75-6-0',
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
