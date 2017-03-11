const SlackBot = require('./../slackbots.js');
const mongoose = require('mongoose');

const config = require('./../config.js');
mongoose.Promise = global.Promise;
mongoose.connect(config.db.path);

const UserMessages = require('./models/usermessage').UserMessages;
const BotMessages = require('./models/botmessage').BotMessages;
const BotSettings = require('./models/botsetting').BotSettings;


// create a bot
const bot = new SlackBot(config.bot);

const messageParams = {};

const botParams = {};


bot.on('start', () => {
  // bot.getUsers().then((res) => console.log(res));
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
  if (data.text) {
    botParams.parrotArray.forEach((item) => {
      botParams.parrotCount += data.text.split(item).length - 1;
    });
    // console.log(botParams.parrotCount);
    BotSettings.update({ name: messageParams.username }, { parrot_counts: botParams.parrotCount }).then();
  }
  if (data.text === 'сколько попугаев?') {
    BotSettings.findOne().then((r) => {
      if (r) {
        bot.postMessageToChannel(botParams.channelName, `Всего отправлено: ${r.parrot_counts} шт.`, messageParams);
      }
    });
  }
  if (data.text === 'есть кто живой?') {
    UserMessages.find().then((r) => {
      if (r) {
        const result = r.sort((a, b) => {
          const c = a.count_messages;
          const d = b.count_messages;

          if (c < d) {
            return 1;
          } else if (c > d) {
            return -1;
          }

          return 0;
        });
        let mes = '';
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

        if (result.length > 20) {
          mes = 'Вот десятка людей, которые подают признаки жизни:\n';
          for (let i = 0; i < 20; i += i) {
            mes += `${i + 1}. ${result[i].user_name}: ${result[i].count_messages} ${messagesRus(result[i].count_messages)} \n`;
          }
        } else {
          mes = 'Вот люди, которые подают признаки жизни: \n';
          result.forEach((item, i) => {
            mes += `${i + 1}. ${item.user_name}: ${item.count_messages} ${messagesRus(result[i].count_messages)}\n`;
          });
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
      `Привет <@${data.user_profile.name}>, ${botParams.messageJoin}`,
      // `Привет <@${data.user_profile.name}>, добро пожаловать в наш ламповый чатик!\n
      // Есть два вопроса к тебе:\n
      // - кто твой любимый эмодзи?\n
      // - какая твоя любимая giphy? \n
      // #friday - это место свободного общения. Здесь любят попугаев и поздравлют всех с пятницей. \n
      // P.S. Если будут обежать, то вызывай милицию! :warneng:`,
      messageParams);
  }

  if (data.type === 'message') {
    BotMessages.findOne({ user_message: data.text })
      .then((result) => {
        if (result) {
          bot.postMessageToChannel(botParams.channelName, result.bot_message, messageParams);
        }
      });

    bot.getUserById(data.user)
      .then((d) => {
        if (d) {
          UserMessages.findOne({ user_id: d.id })
            .then((result) => {
              if (!result) {
                const newMessage = new UserMessages({
                  user_id: d.id,
                  user_name: d.name,
                  user_full_name: d.real_name,
                  count_messages: 1,
                });
                newMessage.save();
              } else {
                const newCountMessages = result.count_messages + 1;
                UserMessages.findOneAndUpdate({ user_id: d.id }, { count_messages: newCountMessages }).then();
              }
            });
        }
      });
  }
});
