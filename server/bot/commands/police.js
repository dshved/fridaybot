'use strict';

const customResponse = [
  'не хорошо так делать.',
  'пэрротов на вас нет!',
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
  const matchUser = myRegexpUser.exec(text);

  if (reg.test(text)) {
    if (matchUser) {
      const randomResponse = Math.floor(Math.random() * (customResponse.length - 1));
      const message = `Господин полицейский к Вашим услугам.\nСпасибо за обращение.\n<${matchUser[0]}>, на вас поступила жалоба, ${customResponse[randomResponse]}`;
      callback(message, {}, attachment);
    } else {
      callback('Господин полицейский всегда на страже закона.\nЕсли у вас жалоба на конкретного человека, то повторите команду и укажите его @username', {}, attachment);
    }
  }
}

module.exports = {
  police: (text, callback, msg) => {
    getPolice(text, callback, msg);
  },
};
