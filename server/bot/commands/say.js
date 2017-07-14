'use strict';

const aParrots = require('./../../../alphabet_parrots.js');
const aEpilepsy = require('./../../../alphabet_epilepsy.js');
const UserMessages = require('./../../models/usermessage').UserMessages;

const replaseEmoji = (value, message) => {
  message =
    value === 'REACT' || value === 'РЕАКТ'
      ? message.replace(/fp/g, 'rt')
      : message;
  message =
    value === 'JS' ||
    value === 'ЖС' ||
    value === 'ДЖС' ||
    value === 'ДЖАВАСКРИПТ' ||
    value === 'JAVASCRIPT'
      ? message.replace(/fp/g, 'js')
      : message;
  message =
    value === 'ANGULAR' || value === 'АНГУЛЯР'
      ? message.replace(/fp/g, 'ag')
      : message;
  message =
    value === 'JQUERY' || value === 'ЖКВЕРИ' || value === 'ДЖКВЕРИ'
      ? message.replace(/fp/g, 'jquery')
      : message;
  message =
    value === 'VUE' || value === 'ВУЙ' || value === 'ВУЕ'
      ? message.replace(/fp/g, 'vue')
      : message;

  return message;
};

const replaceMention = (str, resolve) => {
  const myRegexpChannel = /(#\w+)\|(\w+)/g;
  const myRegexpUser = /@\w+/g;

  const matchChannel = myRegexpChannel.exec(str);
  const matchUser = myRegexpUser.exec(str);
  let message = str;

  if (matchChannel) {
    message = matchChannel[1].substr(0, 1) + matchChannel[2];
    resolve(message);
  }

  if (matchUser) {
    const userId = matchUser[0].substr(1, matchUser[0].length);
    UserMessages.findOne({ user_id: userId }).then(result => {
      if (result) {
        message = `@${result.user_name}`;
        resolve(message);
      }
    });
  }
};

const replaceTextEmoji = str => {
  const myRegexpEmoji = /^(:\w+:)|(:[-\w]+:)/g;
  let matchEmoji = myRegexpEmoji.exec(str);
  let emoji = [];
  while (matchEmoji != null) {
    emoji.push(matchEmoji[0]);
    matchEmoji = myRegexpEmoji.exec(str);
  }
  const myObj = {};
  if (emoji.length) {
    let string = emoji.join(' ');
    myObj.isExec = true;
    myObj.countEmoji = emoji.length;
    myObj.emoji = emoji;
    const message = str.substr(string.length + 1, str.length);
    myObj.message = message ? message : emoji[1];

    return myObj;
  } else {
    myObj.message = str;
    myObj.countEmoji = 0;
    myObj.isExec = false;

    return myObj;
  }
};

const sayText = (text, split, maxW, away, callback) => {
  let newLetterArray = [];
  let newArray = [];
  let sendMessage = '';
  text = text.substr(0, text.length);
  replaceMention(text, function(message) {
    text = message;
  });
  setTimeout(function() {
    const newStr = replaceTextEmoji(text);
    let replaced = false;
    let replacedEmoji;
    let replacedBg;
    if (newStr.isExec) {
      replaced = true;
      replacedEmoji = newStr.emoji[0];
      text = newStr.message ? newStr.message : '';
      if (newStr.countEmoji === 2) {
        replacedBg = newStr.emoji[1];
      }
    }

    if (text.length > maxW) {
      callback('', {
        message: `, ты просишь слишком много... Я могу сказать не больше ${maxW} символов!`,
      });
      return '';
    }
    if (text) {
      if (split) {
        text.match(/.{1,3}/g).forEach(w => {
          newLetterArray.push(w.split(''));
        });
      } else {
        text.match(/.{1}/g).forEach(w => {
          newLetterArray.push(w.split(''));
        });
      }
    }

    newLetterArray.forEach(item => {
      const newArray = [];
      item.forEach(itm => {
        function findLetter(alphabet) {
          return alphabet.letter === itm;
        }
        if (!!aParrots.find(findLetter)) {
          newArray.push(aParrots.find(findLetter).array);
        }
      });
      const lineCount = 6;

      for (let i = 0; i < lineCount; i++) {
        let line = '';
        if (away) {
          line += ':p_petr_rides:';
        }
        if (replacedBg) {
          line += replacedBg;
        }
        for (let j = 0; j < newArray.length; j++) {
          line += newArray[j][i];
        }
        line += '\n';
        sendMessage += line;
      }
    });
    let newMessage = replaseEmoji(text, sendMessage);
    if (replaced) {
      newMessage = newMessage.replace(/:fp:/g, replacedEmoji);
      if (replacedBg) {
        newMessage = newMessage.replace(/:sp:/g, replacedBg);
      }
    }
    if (away) {
      newMessage = newMessage.replace(/:fp:/g, ':bk:');
      newMessage = newMessage.replace(/:sp:/g, ':p_petr_rides:');
    }
    callback(newMessage, {});
  }, 500);
};

const sayEmoji = (text, split, maxW, callback) => {
  if (text.length > maxW) {
    callback('', {
      message: `, ты просишь слишком много... Я могу сказать не больше ${maxW} символов!`,
    });
    return '';
  }
  let userText = text;
  replaceMention(userText, message => {
    userText = message;
  });
  setTimeout(() => {
    const userTextArray = userText.toUpperCase().split('');
    let sendMessage = '';
    userTextArray.forEach(item => {
      function findLetter(alphabet) {
        return alphabet.letter === item;
      }
      if (!!aEpilepsy.find(findLetter)) {
        sendMessage += aEpilepsy.find(findLetter).text;
      }
    });
    callback(sendMessage, {});
    sendMessage = '';
  }, 1000);
};

const sayBorderText = (text, split, maxW, callback) => {
  if (text.length > maxW) {
    callback('', {
      message: `, ты просишь слишком много... Я могу сказать не больше ${maxW} символов!`,
    });
    return '';
  }
  let userText = text;
  let sendMessage = '';
  const newLetterArray = [];
  userText = userText
    .replace(/&AMP;/g, '&')
    .replace(/&LT;/g, '<')
    .replace(/&GT;/g, '>');
  userText.replace(/&AMP;/g, '&').replace(/&LT;/g, '<').replace(/&GT;/g, '>');
  replaceMention(userText, message => {
    userText = message;
  });
  setTimeout(() => {
    userText = userText.toUpperCase();
    const newStr = replaceTextEmoji(userText);
    let replaced = false;
    let replacedEmoji;
    if (newStr.isExec) {
      replaced = true;
      replacedEmoji = newStr.emoji;
      userText = newStr.message;
    }

    let countLetters = userText.length > 16 ? 16 : userText.length;
    const reg = new RegExp(`.{1,${countLetters}}`, 'g');
    userText.match(reg).forEach(w => {
      newLetterArray.push(w.split(''));
    });
    sendMessage += ':cptl:';
    for (let i = 0; i < countLetters; i++) {
      sendMessage += ':cpt:';
    }
    sendMessage += ':cptr:\n';
    newLetterArray.forEach(item => {
      const newArray = [];
      item.forEach(itm => {
        function findLetter(alphabet) {
          return alphabet.letter === itm;
        }
        if (!!aEpilepsy.find(findLetter)) {
          newArray.push(aEpilepsy.find(findLetter).text);
        }
      });

      if (newArray.length < countLetters) {
        let contSpace = countLetters - newArray.length;
        for (let i = 0; i < contSpace; i++) {
          newArray.push(':sp:');
        }
      }
      sendMessage += ':cpl:';
      for (let i = 0; i < newArray.length; i++) {
        if (i == countLetters - 1) {
          sendMessage += `${newArray[i]}:cpr:\n`;
        } else {
          sendMessage += newArray[i];
        }
      }
    });
    sendMessage += ':cpbl:';
    for (let i = 0; i < countLetters; i++) {
      sendMessage += ':cpb:';
    }
    sendMessage += ':cpbr:\n';

    let newMessage = replaseEmoji(userText, sendMessage);
    if (replaced) {
      newMessage = newMessage.replace(
        /:cpt:|:cpb:|:cpl:|:cpr:|:cptl:|:cptr:|:cpbl:|:cpbr:/g,
        replacedEmoji,
      );
    }
    callback(newMessage, {});
    sendMessage = '';
  }, 1000);
};

module.exports = {
  inRow: function(text, callback) {
    sayText(text, true, 20, false, callback);
  },
  inColumn: function(text, callback) {
    sayText(text, false, 20, false, callback);
  },
  emojiText: function(text, callback) {
    sayEmoji(text, false, 300, callback);
  },
  borderText: function(text, callback) {
    sayBorderText(text, false, 300, callback);
  },
  goAway: function(text, callback) {
    sayText(text, true, 20, true, callback);
  },
  sayBorderText,
  sayText,
};
