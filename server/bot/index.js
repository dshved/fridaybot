const SlackBot = require('./../../slackbots.js');
const config = require('./../../config.js');

const botResponse = require('./commands');

const fs = require('fs');

const UserMessages = require('./../models/usermessage').UserMessages;
const BotMessages = require('./../models/botmessage').BotMessages;
const BotSettings = require('./../models/botsetting').BotSettings;
const Statistics = require('./../models/statistics').Statistics;
const getSticker = require('./commands/sticker').getSticker;
const sayText = require('./commands/say').sayText;
const Log = require('./../models/log').Log;

const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');

const bot = new SlackBot(config.bot);
const bot2 = new SlackBot(config.bot2);

const messageParams = {};

const botParams = {};

let channelsList = [];

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

  bot.getChannels().then(res => {
    res.channels.forEach(item => {
      channelsList.push({ id: item.id, name: item.name });
    });
  });
});

bot2.on('start', () => {
  console.log('bot2 started');
});

const isThread = (data, att) => {
  if (data.thread_ts) {
    att.thread_ts = data.thread_ts;
    return att;
  }

  if (att.thread_ts) {
    delete att['thread_ts'];
  }

  return att;
};

const channelName = data => {
  const channel = channelsList.find(c => data.channel === c.id);
  if (channel) {
    return channel.name;
  }
  return 'direct';
};


const sendToWhom = (data, message, attachment) => {
  if (attachment) {
    const att = isThread(data, attachment);
    bot.postMessage(data.channel, message, att);
  } else {
    const att = isThread(data, messageParams);
    bot.postMessage(data.channel, message, att);
  }
};




global.io.on('connection', (socket) => {
  socket.on('post', (data) => {
    if (data) {
      sendToWhom(data, data.message);
    }
  });
});

let accessBotPost;
bot2.on('message', (data) => {
  if (data.text) {
    const message = data.text;
    if (data.channel === config.bot2.connect_channel) {
      const attachment = {};
      bot2.getUserById(data.user).then((res) => {
        attachment.username = `${res.name}, ${config.bot2.slack_name}`;
        attachment.icon_url = res.profile.image_512;
        bot.postMessage(config.bot.connect_channel, message, attachment);
      });
    }
  }
});


bot.on('message', (data) => {
  if (data.text) {
    const message = data.text;
    if (data.channel === config.bot.connect_channel) {
      const attachment = {};
      bot.getUserById(data.user).then((res) => {
        attachment.username = `${res.name}, ${config.bot.slack_name}`;
        attachment.icon_url = res.profile.image_512;
        bot2.postMessage(config.bot2.connect_channel, message, attachment);
      });
    }
  }

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

      const user = data.user ? data.user : data.bot_id;
      const statistic = new Statistics({
        event_type: 'user_message',
        user_id: user,
        timestamp: data.ts,
        parrot_count: countParrots,
      });

      statistic.save();
    }
  }


  if (data.text && data.subtype !== 'bot_message') {
    if (~data.text.indexOf('повтори ') == -1) {
      const userText = data.text.substr(8);
      const att = isThread(data, messageParams);
      bot.postMessageToChannel(botParams.channelName, userText, att);
      accessBotPost = true;
    }
  }

  if (data.text) {
    if (~data.text.indexOf('маска ') == -1) {
      const userText = data.text.substr(6);
      const say = require('./commands/sayHow').parseMessage;
      let {message, attachment} = say(userText);
      bot.postMessageToChannel(botParams.channelName, message, attachment);
    }
  }

  if (data.text) {
    if (~data.text.indexOf('файл ') == -1) {
      let url = data.text.substr(6)
        .replace(/</g, '')
        .replace(/>/g, '');
      const message = '';
      const attachment = {};
      attachment.username = 'fridaybot';
      attachment.icon_emoji = ':fbf:';
      attachment.attachments = [{
        fallback: '',
        image_url: `${url}`,
      }, ];
      bot.postMessageToChannel(botParams.channelName, message, attachment);
    }
  }

  if (data.text) {
    data.text = data.text.toUpperCase();
    const channel = channelName(data);
    const user = data.user ? data.user : data.bot_id;
    UserMessages.findOne({ user_id: user }).then(result => {
      if (result) {

        botResponse.userMessageRes(data, channel, (text, error, attachment) => {
          if (!error.message) {
            if (attachment) {
              sendToWhom(data, text, attachment);
            } else {
              sendToWhom(data, text);
            }
          } else {
            sendToWhom(data, `<@${data.user}> ${error.message}`);
          }
        });
      }
    });
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

  if (data.text) {
    if (~data.text.indexOf('UPTIME') == -1) {
      var millisecToTimeStruct = function(millisec) {
        var days, hours, minutes, seconds;
        if (isNaN(millisec)) {
          return {};
        }
        days = millisec / (60 * 60 * 24);
        hours = (days - ~~days) * 24;
        minutes = (hours - ~~hours) * 60;
        seconds = (minutes - ~~minutes) * 60;
        return `${~~days}:${~~hours}:${~~minutes}:${~~seconds }`;
      };
      const uptime = process.uptime();
      sendToWhom(data, millisecToTimeStruct(uptime));
    }
  }


  if (data.text === 'ПАРОЛЬ') {
    console.log(data.user);
  }

  if (data.subtype === 'channel_leave' && data.channel === botParams.channelId) {
    BotSettings.findOne().then(result => {
      if (result) {
        if (result.user_leave.active) {
          request({
            url: `https://slack.com/api/channels.info?token=${config.bot.token}&channel=${botParams.channelId}`,
            encoding: null,
          },
          (err, res, body) => {
            const json = JSON.parse(body);
            if (json.ok) {
              const countUsers = json.channel.members.length;
              sayText(`:RAGE: ${countUsers}`, true, 10, (callback) => {
                const leaveMessage = callback + result.user_leave.message
                .replace(/first_name/g, data.user_profile.first_name)
                .replace(/real_name/g, data.user_profile.real_name)
                .replace(/name/g, `<@${data.user_profile.name}>`);
                bot.postMessageToChannel(
                  botParams.channelName,
                  leaveMessage,
                  messageParams
                );
              });
            } else {
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
          });
        }
      }
      UserMessages.remove({ user_id: data.user }, (err, result) => {
        if (!err) {
          console.log('Пользователь удален');
        } else {
          console.log(err);
        }
      });

    });
    const statistic = new Statistics({
      event_type: 'channel_leave',
      user_id: data.user,
      timestamp: data.ts,
    });

    statistic.save();
  }


  if (data.subtype === 'channel_join' && data.channel === botParams.channelId) {
    BotSettings.findOne().then(result => {
      if (result) {
        if (result.user_join.active) {
          request({
            url: `https://slack.com/api/channels.info?token=${config.bot.token}&channel=${botParams.channelId}`,
            encoding: null,
          },
          (err, res, body) => {
            const json = JSON.parse(body);
            if (json.ok) {
              const countUsers = json.channel.members.length;
              sayText(`:TADA: ${countUsers}`, true, 10, (callback) => {
                const joinMessage = callback + result.user_join.message
                  .replace(/first_name/g, data.user_profile.first_name)
                  .replace(/real_name/g, data.user_profile.real_name)
                  .replace(/user_name/g, `<@${data.user_profile.name}>`)
                  .replace(/channel_name/g, `<#${botParams.channelId}>`);
                bot.postMessageToChannel(
                  botParams.channelName,
                  joinMessage,
                  messageParams
                );
              });
            } else {
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
          });
        }
      }
    });
    const statistic = new Statistics({
      event_type: 'channel_join',
      user_id: data.user,
      timestamp: data.ts,
    });

    statistic.save();
  }
  if (
    data.type === 'message' &&
    data.channel === botParams.channelId &&
    accessBotPost &&
    data.subtype !== 'channel_leave'
  ) {
    BotMessages.findOne({ user_message: data.text }).then(result => {
      if (result) {
        const att = isThread(data, messageParams);
        bot.postMessageToChannel(
          botParams.channelName,
          result.bot_message,
          att
        );
        accessBotPost = false;
        saveLog(data);
      }
    });
  }

  if (
    data.type === 'message' &&
    data.channel === botParams.channelId &&
    data.subtype !== 'bot_message' &&
    data.subtype !== 'channel_leave'
  ) {
    BotMessages.findOne({ user_message: data.text }).then(result => {
      if (result) {
        const att = isThread(data, messageParams);
        bot.postMessageToChannel(
          botParams.channelName,
          result.bot_message,
          att
        );
        saveLog(data);
      }
    });
    getSticker(data.text, (att) => {
      const attr = isThread(data, att);
      bot.postMessageToChannel(
          botParams.channelName,
          '',
          attr
        );
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
  bot.on('start', () => {
    console.log('start');
  });
});

bot.on('error', e => {
  console.log('error', e);
});
