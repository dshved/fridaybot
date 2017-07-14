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
      let users = [];
      for (let i = 0; i < matchUser.length; i++) {
        users.push(`${matchUser[i]}`);
      }

      const unique = arr => {
        const obj = {};

        for (let i = 0; i < arr.length; i++) {
          const str = arr[i];
          obj[str] = true;
        }

        return Object.keys(obj);
      };

      users = unique(users);

      if (users.length > 5) {
        callback(
          'Автозак не резиновый!\nНе больше 5-ти человек :warneng:',
          {},
          attachment,
        );
      } else {
        const fn = function asyncMultiply(user) {
          return new Promise(resolve => {
            sayBorderText(user, false, 100, cb => {
              resolve(cb);
            });
          });
        };

        const actions = users.map(fn);

        const results = Promise.all(actions);
        results.then(data => {
          const message = `:drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren::drudgesiren:\nСдавайтесь :gun_reverse:\n${data}Вы окружены!!!\n`;
          callback(message, {}, attachment);
        });
      }
    } else {
      callback(
        ':drudgesiren:Господин полицейский всегда на страже закона.:drudgesiren:\nЕсли у вас жалоба на конкретного человека, то повторите команду и укажите его @username',
        {},
        attachment,
      );
    }
  }
}

module.exports = {
  police: (text, callback, msg) => {
    getPolice(text, callback, msg);
  },
};
