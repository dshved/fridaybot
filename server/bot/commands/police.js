'use strict';

const customResponse = [
  'не хорошо так делать.',
  'нужно хорошо себя вести!',
  'еще раз и больше ни разу.',
  'не нарушаете пожалуйста, иначе на вас обрушится `гнев пэрротов`.',
  'не нарушайте, а то ночью вам приснится кошмар от том, как вы стали ВУЙ-разработчиком.',
  'а-та-та.',
];


function getPolice(text, callback, msg) {
  const attachment = {};
  attachment.username = 'милиция';
  attachment.icon_emoji = ':warneng:';
  const reg = new RegExp(msg);
  const myRegexpUser = /@\w+/g;
  const matchUser = text.match(myRegexpUser);

  if (reg.test(text)) {
    if (matchUser) {
      let users = '';
      for (let i = 0; i < matchUser.length; i++) {
        users += `<${matchUser[i]}>, `;
      }
      const randomResponse = Math.floor(Math.random() * (customResponse.length - 1));
      const message = `:drudgesiren:Господин полицейский к Вашим услугам.:drudgesiren:\nСпасибо за обращение.\n${users}на вас поступила жалоба, ${customResponse[randomResponse]}`;
      callback(message, {}, attachment);
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
