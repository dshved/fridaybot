const axios = require('axios');
const querystring = require('querystring');

function getTranslate(text, callback) {
  const obj = {
    id: '8a0e3541.5a3a6dc7.175c81b3-7-0',
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
