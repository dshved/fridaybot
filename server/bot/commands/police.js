'use strict';
const sayBorderText = require('./say').sayBorderText;

function getPolice(text, callback, msg) {
  const attachment = {};
  attachment.username = 'милиция';
  attachment.icon_emoji = ':warneng:';
  const myRegexpUser = /@\w+/g;
  const matchUser = text.match(myRegexpUser);

  if (text.startsWith(msg)) {
    if (matchUser) {
      let users = '';
      for (let i = 0; i < matchUser.length; i++) {
        users += `${matchUser[i]}`;
      }
      sayBorderText(users, false, 100, (cb) => {
        const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:\nСдавайтесь :gun_reverse:\n${cb}Вы окружены!!!\n`;
        callback(message, {}, attachment);
      });
    } else {
      callback(':drudgesiren:Господин полицейский всегда на страже закона.:drudgesiren:\nЕсли у вас жалоба на конкретного человека, то повторите команду и укажите его @username', {}, attachment);
    }
  }
}

module.exports = {
  police: (text, callback, msg) => {
    getPolice(text, callback, msg);
  },
};
