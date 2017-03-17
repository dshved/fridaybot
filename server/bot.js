const SlackBot = require('./../slackbots.js');
const aParrots = require('./../alphabet_parrots.js');
const config = require('./../config.js');
const mongoose = require('mongoose');

const fs = require('fs');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.path);

const UserMessages = require('./models/usermessage').UserMessages;
const BotMessages = require('./models/botmessage').BotMessages;
const BotSettings = require('./models/botsetting').BotSettings;
const Anek = require('./models/anek').Anek;

const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');

const bot = new SlackBot(config.bot);

const messageParams = {};

const botParams = {};

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
    let $ = cheerio.load(iconv.decode(body, 'cp1251'), { decodeEntities: false });

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
      // botParams.channelId = result.channel_id;
      botParams.parrotCount = result.parrot_counts;
      botParams.parrotArray = result.parrot_array;
      botParams.channelName = result.channel_name;
      botParams.messageJoin = result.user_join.message;
      botParams.messageLeave = result.user_leave.message;
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

    const matches = data.text.match(/:fp:|parrot/g);

    if(matches !== null) {
      botParams.parrotCount += matches.length;
      countParrots += matches.length;
    }

    BotSettings.update({ name: messageParams.username }, { parrot_counts: botParams.parrotCount }).then();
  }

  if (data.text) {
    data.text = data.text.toUpperCase();
  }

  if (data.text) {
    if (~data.text.indexOf('СКАЖИ ') == -1) {

      const userText = data.text.substr(6);
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

          // bot.postMessageToChannel(botParams.channelName, sendMessage, messageParams);
        });
        bot.postMessageToChannel(botParams.channelName, sendMessage, messageParams);
        sendMessage = '';
      } else {
        bot.postMessageToChannel(botParams.channelName, `<@${data.user}>, ты просишь слишком много... Я могу сказать не больше 12 символов!`, messageParams);
      }
    }
  }

  if (data.text) {
    if (~data.text.indexOf('ГОВОРИ ') == -1) {
      const userText = data.text.substr(7);
      const userTextArray = userText.toUpperCase().split('');
      let sendMessage = '';
      if (userTextArray.length <= 10) {
        userTextArray.forEach((item) => {
          function findLetter(alphabet) {
            return alphabet.letter === item;
          }
          sendMessage += aParrots.find(findLetter).text;
        });
        bot.postMessageToChannel(botParams.channelName, sendMessage, messageParams);
        sendMessage = '';
      } else {
        bot.postMessageToChannel(botParams.channelName, `<@${data.user}>, ты просишь слишком много... Я могу сказать не больше 10 символов!`, messageParams);
      }
    }
  }

  if (data.text === 'CHANGELOG') {
    bot.postMessageToChannel(botParams.channelName, changelogSlackMessage, messageParams);
  }

  if ((data.text === 'БАШ') || (data.text === 'BASH') || (data.text === 'БАШОРГ')) {
    const randomBashId = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
    bot.postMessageToChannel(botParams.channelName, bashArray[randomBashId], messageParams);
  }

  if (data.text === 'COMMANDS') {
    bot.postMessageToChannel(botParams.channelName, commandsSlackMessage, messageParams);
  }

  if ((data.text === 'БОРОДАТЫЙ АНЕКДОТ') || (data.text === 'АНЕКДОТ') || (data.text === 'РАССКАЖИ АНЕКДОТ')) {
    const randomId = Math.floor(Math.random() * (153260 - 1 + 1)) + 1;
    Anek.findOne({ id: randomId }).then((r) => {
      if (r) {
        bot.postMessageToChannel(botParams.channelName, r.text, messageParams);
      } else {
        bot.postMessageToChannel(botParams.channelName, 'Что-то пошло не так... Попробуйте еще раз', messageParams);
      }
    });
  }

  if ((data.text === 'СКОЛЬКО ПОПУГАЕВ?') || (data.text === 'СКОЛЬКО ПОПУГАЕВ') || (data.text === 'СКОЛЬКО?') || (data.text === 'СКОЛЬКО')) {
    BotSettings.findOne().then((r) => {
      if (r) {
        bot.postMessageToChannel(botParams.channelName, `Всего отправлено: ${r.parrot_counts} шт.`, messageParams);
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
        } else {
          mes = 'Вот люди, которые подают признаки жизни: \n';
          for (let i = 0; i < r.length; i++) {
            mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_messages} ${messagesRus(r[i].count_messages)}\n`;
          }
          bot.postMessageToChannel(botParams.channelName, mes, messageParams);
        }
      });
  }

  if ((data.text === 'КТО ИЛИТА') || (data.text === 'КТО ИЛИТА?') || (data.text === 'ИЛИТА')) {

    UserMessages.find().sort([
        ['count_parrots', 'descending'],
      ])
      .then((r) => {
        let mes = '';
        if (r.length > 10) {
          mes = ':crown:Илита Friday:crown: \n';
          for (let i = 0; i < 10; i++) {
            mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_parrots} pps\n`;
          }
          bot.postMessageToChannel(botParams.channelName, mes, messageParams);
        } else {
          mes = ':crown:Илита Friday:crown: \n';
          for (let i = 0; i < r.length; i++) {
            mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_parrots} pps\n`;
          }
          bot.postMessageToChannel(botParams.channelName, mes, messageParams);
        }
      });
  }

  if (data.subtype === 'channel_leave' && data.channel === botParams.channelId) {
    bot.postMessageToChannel(
      botParams.channelName,
      `Мы потеряли бойца :sad_parrot: ${data.user_profile.first_name}  покинул нас`,
      messageParams);
  }

  if (data.subtype === 'channel_join' && data.channel === botParams.channelId) {
    bot.postMessageToChannel(
      botParams.channelName,
      // `Привет <@${data.user_profile.name}>, ${botParams.messageJoin}`,
      `Привет <@${data.user_profile.name}>, добро пожаловать в наш ламповый чатик!\nЕсть два вопроса к тебе:\n- кто твой любимый эмодзи?\n- какая твоя любимая giphy? \n<#${botParams.channelId}> - это место свободного общения. Здесь любят попугаев и поздравлют всех с пятницей. \nP.S. Если будут обижать, то вызывай милицию! :warneng:`,
      messageParams);
  }

  if (data.type === 'message') {
    BotMessages.findOne({ user_message: data.text })
      .then((result) => {
        if (result) {
          bot.postMessageToChannel(botParams.channelName, result.bot_message, messageParams);
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

          UserMessages.findOneAndUpdate({ user_id: data.user }, { count_parrots: newCountParrots } ).then();
        }
      })
  }
});
