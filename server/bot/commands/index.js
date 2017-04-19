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


const execResponse = (data, text, expr, startFrom, func, callback) => {
  if (startFrom && text.startsWith(expr)) {
    const newLog = data;
    newLog.text = expr;
    saveLog(newLog);
    const userText = text.substr(expr.length);
    func(userText, callback);
  } else if (!startFrom && text === expr) {
    const newLog = data;
    newLog.text = expr;
    saveLog(newLog);
    func(text, callback);
  }
};

const userMessageRes = (data, callback) => {
  const messageText = data.text.toUpperCase();
  msgs.forEach((msg) => {
    execResponse(data, messageText, msg.msg, msg.startFrom, msg.callback,
      (d, error) => {
        callback(d, error);
      });
  });
};

module.exports = {
  userMessageRes,
};
