const request = require('request');
const config = require('./../../../config.js');

function deleteMessage(ts, channelId) {
  const text = encodeURI('Бот успешно выключен!\nЧтобы включить бота воспользуйтесь командой `включить бота`\nДля проверки статуса воспользуйтесь командой `статус бота`');
  let updateMessageUrl = `https://slack.com/api/chat.update?token=${config.bot
        .token}&channel=${channelId}&text=${text}&ts=${ts}&as_user=fridaybot&pretty=1`;
  request({ url: updateMessageUrl }, (err, res, body) => {});
}

function updateMessage(ts, channelId) {

  const messagesArray = ['пять...', 'четыре...', 'три...', 'два...', 'один...', 'ноль...'];
  var arr = [];

  for (let i = 0; i < 6; i++) {
    let text = encodeURI('Бот будет выключен через: ' + messagesArray[i]);
    let updateMessageUrl = `https://slack.com/api/chat.update?token=${config.bot
        .token}&channel=${channelId}&text=${text}&ts=${ts}&as_user=fridaybot&pretty=1`;
    arr.push(() => {
      return setTimeout(() => {
        return request({ url: updateMessageUrl }, (err, res, body) => {});
      }, 1000 * i)
    });
  }
  arr.push(() => {
    return setTimeout(() => {
      return deleteMessage(ts, channelId);
    }, 6000);
  });

  arr.forEach(item => item());

}


function stopBot(channelId) {

  let text = encodeURI('Бот будет выключен через:');

  request({
      url: `https://slack.com/api/chat.postMessage?token=${config.bot
        .token}&channel=${channelId}&text=${text}&as_user=fridaybot&pretty=1`,
      encoding: null,
    },
    (err, res, body) => {
      const json = JSON.parse(body);
      if (json.ok) {
        updateMessage(json.ts, channelId);
      }
    }
  );
}


module.exports = {
  activeBot: function(channelId) {
    stopBot(channelId);
  },
}
