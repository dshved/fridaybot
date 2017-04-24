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
    if (access) {
      if (entrance) {
        func(text, callback, msg);
      } else if (startFrom && text.startsWith(msg)) {
        const newLog = data;
        newLog.text = msg;
        saveLog(newLog);
        const userText = text.substr(msg.length);
        if (userText) {
          func(userText, callback);
        }
      } else if (!startFrom && text === msg) {
        const newLog = data;
        newLog.text = msg;
        saveLog(newLog);
        func(text, callback);
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
