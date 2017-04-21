'use strict';

const msgs = require('./messages').messages;
const Log = require('./../../models/log').Log;

const saveLog = (d) => {
  const newCommand = new Log({
    user: d.user,
    command: d.text,
    date: d.ts,
  });
  newCommand.save();
};


const execResponse = (data, channel, text, expr, startFrom, entrance, channels, func, callback) => {
  const access = channels.find(cl => cl === channel);

  expr.forEach((msg) => {
    const attachment = {};
    attachment.username = 'милиция';
    attachment.icon_emoji = ':warneng:';
    if (entrance) {
      if (access) {
        func(text, callback, msg);
      } else {
        callback('Вы превышаете полномочия!', {},attachment);
      }

    } else if (startFrom && text.startsWith(msg)) {
      if (access) {
        const newLog = data;
        newLog.text = msg;
        saveLog(newLog);
        const userText = text.substr(msg.length);
        if (userText) {
          func(userText, callback);
        }
      } else {
        callback('Вы превышаете полномочия!', {},attachment);
      }
    } else if (!startFrom && text === msg) {
      if (access) {
        const newLog = data;
        newLog.text = msg;
        saveLog(newLog);
        func(text, callback);
      } else {
        callback('Вы превышаете полномочия!', {},attachment);
      }
    }
  });
};


const userMessageRes = (data, channel, callback) => {
  const messageText = data.text.toUpperCase();
  msgs.forEach((msg) => {
    execResponse(
      data,
      channel,
      messageText,
      msg.messages,
      msg.startFrom,
      msg.entrance,
      msg.channels,
      msg.callback,
      (d, error, attachment) => {
        callback(d, error, attachment);
      });
  });
};

module.exports = {
  userMessageRes,
};
