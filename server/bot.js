const SlackBot = require('./../slackbots.js');
const aParrots = require('./../alphabet_parrots.js');
const config = require('./../config.js');

const fs = require('fs');

const UserMessages = require('./models/usermessage').UserMessages;
const BotMessages = require('./models/botmessage').BotMessages;
const BotSettings = require('./models/botsetting').BotSettings;
const Anek = require('./models/anek').Anek;
const Log = require('./models/log').Log;

const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');

const bot = new SlackBot(config.bot);

const messageParams = {};

const botParams = {};


const saveLog = (d) => {
  const newCommand = new Log({
    user: d.user,
    command: d.text,
    date: d.ts,
  });
  newCommand.save();
};

const commandsSlackMessage = fs.readFileSync(__dirname + '/./../COMMANDS_SLACK.txt', 'utf-8');
const changelogSlackMessage = fs.readFileSync(__dirname + '/./../CHANGELOG.md', 'utf-8');

let bashArray = [];

setInterval(() => {
  bashArray = [];
  request({
      url: 'http://bash.im/random',
      encoding: null,
    },
    (err, res, body) => {
      const $ = cheerio.load(iconv.decode(body, 'cp1251'), { decodeEntities: false });

      const quote = $('#body > .quote > .text');

      quote.each((i, post) => {
        bashArray[i] = $(post).html()
          .replace(/<br>/g, '\n')
          .replace(/&quot;/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      });
    });
}, 180000);

const replaseEmoji = (value, message) => {
  message = value === 'REACT' || value === 'РЕАКТ' ? message.replace(/fp/g, 'rt') : message;
  message = value === 'JS' || value === 'ЖС' || value === 'ДЖС' || value === 'ДЖАВАСКРИПТ' || value === 'JAVASCRIPT' ? message.replace(/fp/g, 'js') : message;
  message = value === 'ANGULAR' || value === 'АНГУЛЯР' ? message.replace(/fp/g, 'ag') : message;
  message = value === 'JQUERY' || value === 'ЖКВЕРИ' || value === 'ДЖКВЕРИ' ? message.replace(/fp/g, 'jquery') : message;
  message = value === 'VUE' || value === 'ВУЙ' || value === 'ВУЕ' ? message.replace(/fp/g, 'vue') : message;

  return message;
};


const replaceMention = function(str, resolve) {
  const myRegexpChannel = /(#\w+)\|(\w+)/g;
  const myRegexpUser = /@\w+/g;

  const matchChannel = myRegexpChannel.exec(str);
  const matchUser = myRegexpUser.exec(str);
  let message = str;

  if (matchChannel) {
    message = matchChannel[1].substr(0, 1) + matchChannel[2];
    resolve(message);
  }

  if (matchUser) {
    const userId = matchUser[0].substr(1, matchUser[0].length);
    UserMessages.findOne({ user_id: userId })
      .then((result) => {
        if (result) {
          message = `@${result.user_name}`;
          resolve(message);
        }
      });
  }
};


const replaceTextEmoji = function(str) {
  // const myRegexpEmoji = /^:\w+:/g;
  const myRegexpEmoji = /^(:\w+:)|(:\w+.*.\w+:)/g;
  const matchEmoji = myRegexpEmoji.exec(str);
  console.log(matchEmoji);
  const myObj = {};
  if (matchEmoji) {
    myObj.isExec = true;
    myObj.emoji = matchEmoji[0];
    myObj.message = str.substr(matchEmoji[0].length + 1, str.length);
    return myObj;
  } else {
    myObj.message = str;
    myObj.isExec = false;
    return myObj;
  }
};


bot.on('start', () => {
  bot.getUser(config.bot.name).then((res) => {
    if (res) {
      botParams.botId = res.id;
    }
  });

  BotSettings.findOne().then((result) => {
    if (result) {
      messageParams.username = result.name;
      messageParams.icon_emoji = result.icon.emoji;
      // messageParams.parse = 'full';
      // botParams.channelId = result.channel_id;
      botParams.parrotCount = result.parrot_counts;
      botParams.parrotArray = result.parrot_array;
      botParams.channelName = result.channel_name;

      botParams.joinActive = result.user_join.active;
      botParams.joinMessage = result.user_join.message;

      botParams.leaveActive = result.user_leave.active;
      botParams.leaveMessage = result.user_leave.message;

      if (!result.channel_id) {
        bot.getChannel(result.channel_name).then((data) => {
          if (data) {
            BotSettings.update({ channel_name: result.channel_name }, { channel_id: data.id }).then();
            botParams.channelId = result.channel_id;
          }
        });
      } else {
        botParams.channelId = result.channel_id;
      }
    } else {
      const newSettings = new BotSettings({});
      newSettings.save().then(() => {
        BotSettings.findOne().then((r) => {
          bot.getChannel(r.channel_name).then((data) => {
            if (data) {
              BotSettings.update({ channel_name: r.channel_name }, { channel_id: data.id }).then();
              botParams.channelId = r.channel_id;
              botParams.parrotCount = r.parrot_counts;
              botParams.parrotArray = r.parrot_array;
            }
          });
        });
      });
    }
  });
});

bot.on('message', (data) => {
  // console.log(data);
  const sendToWhom = (d, m) => {
    if (d.channel === botParams.channelId) {
      bot.postMessageToChannel(botParams.channelName, m, messageParams);
    } else {
      bot.getUserById(d.user).then((res) => {
        if (res) {
          botParams.botId = res.id;
          bot.postMessageToUser(res.name, m, messageParams);
        }
      });
    }
  };
  let countParrots = 0;
  if (data.text) {
    if (data.channel === botParams.channelId) {

      const matches = data.text.match(/:fp:|parrot/g);

      if (matches !== null) {
        botParams.parrotCount += matches.length;
        countParrots += matches.length;
      }

      BotSettings.update({ name: messageParams.username }, { parrot_counts: botParams.parrotCount }).then();
      global.io.emit('parrot count', botParams.parrotCount);
    }
  }

  if (data.text) {
    if (~data.text.indexOf('повтори ') == -1) {
      const userText = data.text.substr(8);
      bot.postMessageToChannel(botParams.channelName, userText, messageParams);
    }
  }

  if (data.text) {
    data.text = data.text.toUpperCase();
  }

  if (data.text) {
    if (~data.text.indexOf('СКАЖИ ') == -1) {

      let userText = data.text.substr(6);
      replaceMention(userText, function(message) {
        userText = message;
      });
      const newStr = replaceTextEmoji(userText);
      let replaced = false;
      let replacedEmoji;
      if (newStr.isExec) {
        replaced = true;
        replacedEmoji = newStr.emoji;
        userText = newStr.message;
      }
      setTimeout(function() {
        const userTextArray = userText.toUpperCase().split('');
        if (userTextArray.length <= 12) {
          const newLetterArray = [];
          const countLetter = 3;
          const count = Math.ceil(userTextArray.length / countLetter);
          for (let i = 0; i < count; i++) {
            newLetterArray.push(userTextArray.slice(i * countLetter, (i + 1) * countLetter));
          }
          let sendMessage = '';
          newLetterArray.forEach((item) => {
            const newArray = [];
            item.forEach((itm) => {
              function findLetter(alphabet) {
                return alphabet.letter === itm;
              }
              if (!!aParrots.find(findLetter)) {
                newArray.push(aParrots.find(findLetter).array);
              }
            });
            const userSays = newArray;

            const lineCount = 6;

            for (let i = 0; i < lineCount; i++) {
              let line = '';
              for (let j = 0; j < userSays.length; j++) {
                line += userSays[j][i];
              }
              line += '\n';
              sendMessage += line;
            }
          });
          let newMessage = replaseEmoji(userText, sendMessage);
          if (replaced) {
            newMessage = newMessage.replace(/:fp:/g, replacedEmoji);
          }
          bot.postMessageToChannel(botParams.channelName, newMessage, messageParams);
          sendMessage = '';

          const newData = data;
          newData.text = 'СКАЖИ';
          saveLog(newData);
        } else {
          bot.postMessageToChannel(botParams.channelName, `<@${data.user}>, ты просишь слишком много... Я могу сказать не больше 12 символов!`, messageParams);
        }
      }, 1000);
    }
  }

  if (data.text) {
    if (~data.text.indexOf('ГОВОРИ ') == -1) {
      let userText = data.text.substr(7);
      replaceMention(userText, function(message) {
        userText = message;
      });
      const newStr = replaceTextEmoji(userText);
      let replaced = false;
      let replacedEmoji;
      if (newStr.isExec) {
        replaced = true;
        replacedEmoji = newStr.emoji;
        userText = newStr.message;
      }
      setTimeout(function() {
        const userTextArray = userText.toUpperCase().split('');
        let sendMessage = '';
        if (userTextArray.length <= 10) {
          userTextArray.forEach((item) => {
            function findLetter(alphabet) {
              return alphabet.letter === item;
            }
            sendMessage += aParrots.find(findLetter).text;
          });
          let newMessage = replaseEmoji(userText, sendMessage);
          if (replaced) {
            newMessage = newMessage.replace(/:fp:/g, replacedEmoji);
          }
          bot.postMessageToChannel(botParams.channelName, newMessage, messageParams);
          sendMessage = '';

          const newData = data;
          newData.text = 'ГОВОРИ';
          saveLog(newData);
        } else {
          bot.postMessageToChannel(botParams.channelName, `<@${data.user}>, ты просишь слишком много... Я могу сказать не больше 10 символов!`, messageParams);
        }
      }, 1000);
    }
  }

  if (data.text === 'CHANGELOG') {
    bot.postMessageToChannel(botParams.channelName, changelogSlackMessage, messageParams);
    saveLog(data);
  }

  if ((data.text === 'БАШ') || (data.text === 'BASH') || (data.text === 'БАШОРГ')) {
    const randomBashId = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
    bot.postMessageToChannel(botParams.channelName, bashArray[randomBashId], messageParams);
    saveLog(data);
  }

  if (data.text === 'COMMANDS') {
    bot.postMessageToChannel(botParams.channelName, commandsSlackMessage, messageParams);
    saveLog(data);
  }

  if (data.text === 'LOG') {
    Log.aggregate([{
        $group: {
          _id: '$command',
          count: { $sum: 1 },
        },
      }, {
        $sort: { count: -1 },
      }, ],
      function(err, res) {
        let mes = 'Статистика вызова команд:\n';
        for (let i = 0; i < res.length; i++) {
          mes += `${i + 1}. ${res[i]._id} - ${res[i].count}\n`;
        }
        bot.postMessageToChannel(botParams.channelName, mes, messageParams);
        mes = '';
      }
    );
  }

  if ((data.text === 'БОРОДАТЫЙ АНЕКДОТ') || (data.text === 'АНЕКДОТ') || (data.text === 'РАССКАЖИ АНЕКДОТ')) {
    const randomId = Math.floor(Math.random() * (153260 - 1 + 1)) + 1;
    Anek.findOne({ id: randomId }).then((r) => {
      if (r) {
        bot.postMessageToChannel(botParams.channelName, r.text, messageParams);
        saveLog(data);
      } else {
        bot.postMessageToChannel(botParams.channelName, 'Что-то пошло не так... Попробуйте еще раз', messageParams);
      }
    });
  }

  if ((data.text === 'СКОЛЬКО ПОПУГАЕВ?') || (data.text === 'СКОЛЬКО ПОПУГАЕВ') || (data.text === 'СКОЛЬКО?') || (data.text === 'СКОЛЬКО')) {
    BotSettings.findOne().then((r) => {
      if (r) {
        bot.postMessageToChannel(botParams.channelName, `Всего отправлено: ${r.parrot_counts} шт.`, messageParams);
        saveLog(data);
      }
    });
  }

  if ((data.text === 'ЕСТЬ КТО ЖИВОЙ?') || (data.text === 'ЕСТЬ КТО ЖИВОЙ') || (data.text === 'ЕСТЬ КТО') || (data.text === 'ЕСТЬ КТО?') || (data.text === 'КТО ЖИВОЙ?') || (data.text === 'КТО ЖИВОЙ')) {

    const messagesRus = (num) => {
      num = Math.abs(num);
      num %= 100;
      if (num >= 5 && num <= 20) {
        return 'сообщений';
      }
      num %= 10;
      if (num === 1) {
        return 'сообщение';
      }
      if (num >= 2 && num <= 4) {
        return 'сообщения';
      }
      return 'сообщений';
    };

    UserMessages.find().sort([
        ['count_messages', 'descending'],
      ])
      .then((r) => {
        let mes = '';
        if (r.length > 10) {
          mes = 'TOP 10: \n';
          for (let i = 0; i < 10; i++) {
            mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_messages} ${messagesRus(r[i].count_messages)}\n`;
          }
          bot.postMessageToChannel(botParams.channelName, mes, messageParams);
          saveLog(data);
        } else {
          mes = 'Вот люди, которые подают признаки жизни: \n';
          for (let i = 0; i < r.length; i++) {
            mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_messages} ${messagesRus(r[i].count_messages)}\n`;
          }
          bot.postMessageToChannel(botParams.channelName, mes, messageParams);
          saveLog(data);
        }
      });
  }

  if ((data.text === 'КТО ИЛИТА') || (data.text === 'КТО ИЛИТА?') || (data.text === 'ИЛИТА')) {

    UserMessages.find({ user_name: { $ne: 'slackbot' } }).sort([
        ['count_parrots', 'descending'],
      ])
      .then((r) => {
        let mes = '';
        if (r.length > 10) {
          mes = ':crown:Илита Friday:crown: \n';
          for (let i = 0; i < 10; i++) {
            if (r[i].count_parrots > 0) {
              mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_parrots} ppm\n`;
            }
          }
          UserMessages.findOne({ user_name: 'slackbot' })
            .then((d) => {
              if (d) {
                mes += `----------------------\n:crown: ${d.user_name}: ${d.count_parrots} ppm\n`;
              }
              bot.postMessageToChannel(botParams.channelName, mes, messageParams);
              saveLog(data);
            });
        } else {
          mes = ':crown:Илита Friday:crown: \n';
          for (let i = 0; i < r.length; i++) {
            mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_parrots} ppm\n`;
          }
          UserMessages.findOne({ user_name: 'slackbot' })
            .then((d) => {
              if (d) {
                mes += `----------------------\n:crown: ${d.user_name}: ${d.count_parrots} ppm\n`;
              }
              bot.postMessageToChannel(botParams.channelName, mes, messageParams);
              saveLog(data);
            });
        }
      });
  }

  if (data.subtype === 'channel_leave' && data.channel === botParams.channelId) {
    if (botParams.leaveActive) {
      const leaveMessage = botParams.leaveMessage
        .replace(/first_name/g, data.user_profile.first_name)
        .replace(/real_name/g, data.user_profile.real_name)
        .replace(/name/g, `<@${data.user_profile.name}>`);
      bot.postMessageToChannel(
        botParams.channelName,
        leaveMessage,
        messageParams);
    }
  }

  if (data.subtype === 'channel_join' && data.channel === botParams.channelId) {
    if (botParams.joinActive) {
      const joinMessage = botParams.joinMessage
        .replace(/first_name/g, data.user_profile.first_name)
        .replace(/real_name/g, data.user_profile.real_name)
        .replace(/name/g, `<@${data.user_profile.name}>`)
        .replace(/channel_name/g, `<${botParams.channelId}>`);
      bot.postMessageToChannel(
      botParams.channelName, joinMessage,
      messageParams);
    }
  }

  if (data.type === 'message' && data.channel === botParams.channelId && data.subtype !== 'bot_message') {
    BotMessages.findOne({ user_message: data.text })
      .then((result) => {
        if (result) {
          bot.postMessageToChannel(botParams.channelName, result.bot_message, messageParams);
          saveLog(data);
        }
      });
    UserMessages.findOne({ user_id: data.user })
      .then((result) => {
        if (!result) {
          bot.getUserById(data.user)
            .then((d) => {
              const newMessage = new UserMessages({
                user_id: d.id,
                user_name: d.name,
                user_full_name: d.real_name,
                count_messages: 1,
                count_parrots: 0,
              });
              newMessage.save(d.id);
            });
        } else {
          const newCountParrots = result.count_parrots + countParrots;
          const newCountMessages = result.count_messages + 1;

          UserMessages.findOneAndUpdate({ user_id: data.user }, { count_parrots: newCountParrots, count_messages: newCountMessages }).then();
        }
      });
  }
});
