const SlackBot = require('./../../slackbots.js');
const config = require('./../../config.js');

const botResponse = require('./commands');

const fs = require('fs');

const UserMessages = require('./../models/usermessage').UserMessages;
const BotMessages = require('./../models/botmessage').BotMessages;
const BotSettings = require('./../models/botsetting').BotSettings;
const Anek = require('./../models/anek').Anek;
const Log = require('./../models/log').Log;

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


let bashArray = [];

setInterval(() => {
  bashArray = [];
  request(
    {
      url: 'http://bash.im/random',
      encoding: null,
    },
    (err, res, body) => {
      const $ = cheerio.load(iconv.decode(body, 'cp1251'), {
        decodeEntities: false,
      });

      const quote = $('#body > .quote > .text');

      quote.each((i, post) => {
        bashArray[i] = $(post)
          .html()
          .replace(/<br>/g, '\n')
          .replace(/&quot;/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      });
    }
  );
}, 180000);



bot.on('start', () => {
  bot.getUser(config.bot.name).then(res => {
    if (res) {
      botParams.botId = res.id;
    }
  });

  BotSettings.findOne().then(result => {
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
        bot.getChannel(result.channel_name).then(data => {
          if (data) {
            BotSettings.update(
              { channel_name: result.channel_name },
              { channel_id: data.id }
            ).then();
            botParams.channelId = result.channel_id;
          }
        });
      } else {
        botParams.channelId = result.channel_id;
      }
    } else {
      const newSettings = new BotSettings({});
      newSettings.save().then(() => {
        BotSettings.findOne().then(r => {
          bot.getChannel(r.channel_name).then(data => {
            if (data) {
              BotSettings.update(
                { channel_name: r.channel_name },
                { channel_id: data.id }
              ).then();
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

const sendToWhom = (data, message, attachment) => {
  if (data.channel[0] === 'C') {
    bot.getChannelById(data.channel).then(res => {
      if (res) {
        const channelName = res.name;
        if (attachment) {
          bot.postMessageToChannel(channelName, message, attachment);
        } else {
          bot.postMessageToChannel(channelName, message, messageParams);
        }
      }
    });
  } else {
    bot.getUserById(data.user).then(res => {
      if (res) {
        const userName = res.name;
        if (attachment) {
          bot.postMessageToUser(userName, message, attachment);
        } else {
          bot.postMessageToUser(userName, message, messageParams);
        }
      }
    });
  }
};


global.io.on('connection', (socket) => {
  socket.on('post', (data) => {
    if (data) {
      sendToWhom(data, data.message);
    }
  });
});


bot.on('message', (data) => {
  global.io.emit('data', data);
  // console.log(data);
  let countParrots = 0;
  if (data.text) {
    if (data.channel === botParams.channelId) {
      const matches = data.text.match(/:fp:|parrot/g);

      if (matches !== null) {
        botParams.parrotCount += matches.length;
        countParrots += matches.length;
      }

      BotSettings.update(
        { name: messageParams.username },
        { parrot_counts: botParams.parrotCount }
      ).then();
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
    let channel;
    if (data.channel[0] === 'C') {
      bot.getChannelById(data.channel).then(res => {
        if (res) {
          channel = res.name;
        }
      });
    } else {
      channel = 'direct';
    }
    setTimeout(() => {
      botResponse.userMessageRes(data, channel, (text, error, attachment) => {
        if (!error.message) {
          if (attachment) {
            sendToWhom(data, text, attachment);
            // bot.postMessageToChannel(botParams.channelName, text, messageParams);
          } else {
            sendToWhom(data, text);
          }
        } else {
          sendToWhom(data, `<@${data.user}> ${error.message}`);
          // bot.postMessageToChannel(botParams.channelName, `<@${data.user}> `+error.message, messageParams);
        }
      });
    }, 500);
  }


  if (data.text) {
    data.text = data.text.toUpperCase();
  }


  if (data.text === 'БАШ' || data.text === 'BASH' || data.text === 'БАШОРГ') {
    const randomBashId = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
    bot.postMessageToChannel(
      botParams.channelName,
      bashArray[randomBashId],
      messageParams
    );
    saveLog(data);
  }

  if (data.text === 'ПАРОЛЬ') {
    console.log(data.user);
  }

  if (data.subtype === 'channel_leave' && data.channel === botParams.channelId) {
    BotSettings.findOne().then(result => {
      if (result) {
        if (result.user_leave.active) {
          const leaveMessage = result.user_leave.message
            .replace(/first_name/g, data.user_profile.first_name)
            .replace(/real_name/g, data.user_profile.real_name)
            .replace(/name/g, `<@${data.user_profile.name}>`);
          bot.postMessageToChannel(
            botParams.channelName,
            leaveMessage,
            messageParams
          );
        }
      }
    });
  }


  if (data.subtype === 'channel_join' && data.channel === botParams.channelId) {
    BotSettings.findOne().then(result => {
      if (result) {
        if (result.user_join.active) {
          const joinMessage = result.user_join.message
            .replace(/first_name/g, data.user_profile.first_name)
            .replace(/real_name/g, data.user_profile.real_name)
            .replace(/user_name/g, `<@${data.user_profile.name}>`)
            .replace(/channel_name/g, `<#${botParams.channelId}>`);
          bot.postMessageToChannel(
            botParams.channelName,
            joinMessage,
            messageParams
          );
        }
      }
    });

  }

  if (
    data.type === 'message' &&
    data.channel === botParams.channelId &&
    data.subtype !== 'bot_message'
  ) {
    BotMessages.findOne({ user_message: data.text }).then(result => {
      if (result) {
        bot.postMessageToChannel(
          botParams.channelName,
          result.bot_message,
          messageParams
        );
        saveLog(data);
      }
    });
    UserMessages.findOne({ user_id: data.user }).then(result => {
      if (!result) {
        bot.getUserById(data.user).then(d => {
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

        UserMessages.findOneAndUpdate(
          { user_id: data.user },
          { count_parrots: newCountParrots, count_messages: newCountMessages }
        ).then();
      }
    });
  }
});


bot.on('close', e => {
  console.log('websocket closing', e);
});

bot.on('error', e => {
  console.log('error', e);
});
