const axios = require('axios');
const querystring = require('querystring');

function getTranslate(text, callback) {
  const obj = {
    id: '9b2a53be.5b100727.12dbbc2f-0-0',
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
