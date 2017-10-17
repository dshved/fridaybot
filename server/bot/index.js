const SlackBot = require('./../../slackbots.js');
const config = require('./../../config.js');
const request = require('request');
const botResponse = require('./commands');

const fs = require('fs');

const UserMessages = require('./../models/usermessage').UserMessages;
const BotMessages = require('./../models/botmessage').BotMessages;
const BotSettings = require('./../models/botsetting').BotSettings;
const Statistics = require('./../models/statistics').Statistics;
const getSticker = require('./commands/sticker').getSticker;
const sayText = require('./commands/say').sayText;
const Log = require('./../models/log').Log;

const deleteParrots = require('./commands/delmessages').deleteParrots;
const userJoin = require('./commands/userJoin').userJoin;
const userLeave = require('./commands/userLeave').userLeave;

const bot = new SlackBot(config.bot);
const bot2 = new SlackBot(config.bot2);

const messageParams = {};

const botParams = {};

let channelsList = [];

const saveLog = d => {
  const newCommand = new Log({
    user: d.user,
    command: d.text,
    date: d.ts,
  });
  newCommand.save();
};

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
              { channel_id: data.id },
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
                { channel_id: data.id },
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

global.io.on('connection', socket => {
  socket.on('post', data => {
    if (data) {
      sendToWhom(data, data.message);
    }
  });
});

let accessBotPost;
bot2.on('message', data => {
  if (data.text) {
    const message = data.text;
    if (data.channel === config.bot2.connect_channel) {
      const attachment = {};
      bot2.getUserById(data.user).then(res => {
        attachment.username = `${res.name}, ${config.bot2.slack_name}`;
        attachment.icon_url = res.profile.image_512;
        bot.postMessage(config.bot.connect_channel, message, attachment);
      });
    }
  }
});

bot.on('message', data => {
  // if (data.subtype === 'message_changed') {
  //   data.text = data.message.text;
  //   data.user = data.message.user;
  // }
  if (data.text) {
    const message = data.text;
    if (data.channel === config.bot.connect_channel) {
      const attachment = {};
      bot.getUserById(data.user).then(res => {
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
        { parrot_counts: botParams.parrotCount },
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
    if (~data.text.toUpperCase().indexOf('ПОВТОРИ ') == -1) {
      const userText = data.text.substr(8);
      const att = isThread(data, messageParams);
      bot.postMessageToChannel(botParams.channelName, userText, att);
      accessBotPost = true;
    }
  }

  if (data.text) {
    if (~data.text.toUpperCase().indexOf('MASK ') == -1) {
      const userText = data.text.substr(5);
      const userTextArray = userText.split(' ');
      const userID = userTextArray[0].slice(2, -1);
      if (userID) {
        request(
          {
            url: `https://slack.com/api/users.info?token=${config.bot
              .token}&user=${userID}&pretty=1`,
            encoding: null,
          },
          (err, res, body) => {
            const json = JSON.parse(body);
            if (json.ok) {
              const attachment = {};
              attachment.username = json.user.name;
              attachment.icon_url = json.user.profile.image_72;

              let message = '';
              for (var i = 1; i < userTextArray.length; i++) {
                message += userTextArray[i] + ' ';
              }
              bot.postMessageToChannel(
                botParams.channelName,
                message,
                attachment,
              );
            }
          },
        );
      }
    }
  }

  if (data.text) {
    if (~data.text.toUpperCase().indexOf('МАСКА ') == -1) {
      const userText = data.text.substr(6);
      const say = require('./commands/sayHow').parseMessage;
      let { message, attachment } = say(userText);
      bot.postMessageToChannel(botParams.channelName, message, attachment);
    }
  }

  if (data.text) {
    if (~data.text.toUpperCase().indexOf('СОВЕРШИТЬ БОЛЬШУЮ ГЛУПОСТЬ') == -1) {
      deleteParrots(botParams.channelId);
    }
  }

  if (data.text) {
    if (~data.text.toUpperCase().indexOf('CLEAR') == -1) {
      deleteParrots(botParams.channelId);
    }
  }

  if (data.text) {
    if (~data.text.toUpperCase().indexOf('ФАЙЛ ') == -1) {
      let url = data.text
        .substr(6)
        .replace(/</g, '')
        .replace(/>/g, '');
      const message = '';
      const attachment = {};
      attachment.username = 'fridaybot';
      attachment.icon_emoji = ':fridaybot_new:';
      attachment.attachments = [
        {
          fallback: '',
          image_url: `${url}`,
        },
      ];
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
        return `${~~days}:${~~hours}:${~~minutes}:${~~seconds}`;
      };
      const uptime = process.uptime();
      sendToWhom(data, millisecToTimeStruct(uptime));
    }
  }

  if (data.text === 'ПАРОЛЬ') {
    console.log(data.user);
  }

  if (
    data.subtype === 'channel_leave' &&
    data.channel === botParams.channelId
  ) {
    userLeave(data, botParams, message => {
      if (messageParams.thread_ts) {
        delete messageParams['thread_ts'];
      }
      bot.postMessageToChannel(botParams.channelName, message, messageParams);
    });
    const statistic = new Statistics({
      event_type: 'channel_leave',
      user_id: data.user,
      timestamp: data.ts,
    });

    statistic.save();
  }

  if (data.subtype === 'channel_join' && data.channel === botParams.channelId) {
    userJoin(data, botParams, message => {
      if (messageParams.thread_ts) {
        delete messageParams['thread_ts'];
      }
      bot.postMessageToChannel(botParams.channelName, message, messageParams);
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
          att,
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
          att,
        );
        saveLog(data);
      }
    });
    getSticker(data, att => {
      const attr = isThread(data, att);
      bot.postMessageToChannel(botParams.channelName, '', attr);
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
          {
            count_parrots: newCountParrots,
            count_messages: newCountMessages,
          },
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
