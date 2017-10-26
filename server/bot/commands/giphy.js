const request = require('request');

const getGiphy = (text, callback) => {
  const url = `http://api.giphy.com/v1/gifs/random?api_key=a81da363e2174657a4d2a5c4091d303e&tag=${text}`;

  request(
    {
      url,
      encoding: null,
    },
    (err, res, body) => {
      const json = JSON.parse(body);
      const attachment = {};
      attachment.username = 'giphy';
      attachment.icon_emoji = ':giphy:';
      if (json.meta.status === 200 && Object.keys(json.data).length) {
        attachment.attachments = [
          {
            fallback: 'Giphy',
            color: '#36a64f',
            title: `Giphy/${text}`,
            image_url: json.data.image_url,
          },
        ];
        callback('', {}, attachment);
      }
    },
  );
};

module.exports = {
  getGiphy: (text, callback) => {
    getGiphy(text, callback);
  },
};
