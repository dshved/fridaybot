const Donate = require('../../models/donate');

const getDonate = async (text, callback) => {
  const result = await Donate.find({});
  let message = '*Уже помогли*\n';
  result.forEach(item => {
    message += `:fp: ${item.user}\n`;
  });
  message += 'Вы также можете помочь проекту https://fridaybot.tk/donate';
  callback(message, {});
};

module.exports = getDonate;
