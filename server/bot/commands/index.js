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


const execResponse = function (data, text, expr, startFrom, func, callback) {
  if (startFrom && text.startsWith(expr)) {
    let newLog = data;
    newLog.text = expr;
    saveLog(newLog);
    const userText = text.substr(expr.length);
    func(userText, callback);
  } else if (!startFrom && text === expr) {
    let newLog = data;
    newLog.text = expr;
    saveLog(newLog);
    func(text, callback);
  }
};

const userMessageRes = function (data, callback) {

  const messageText = data.text.toUpperCase();
  msgs.forEach(function (msg) {
    execResponse(data, messageText, msg.msg, msg.startFrom, msg.callback,
      function (data, error) {
        callback(data, error);
    });
  });
};

module.exports = {
  userMessageRes,
};
