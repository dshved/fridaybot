'use strict';

const aParrots = require('./../../../alphabet_parrots.js');
const UserMessages = require('./../../models/usermessage').UserMessages;

const replaseEmoji = (value, message) => {
  message = value === 'REACT' || value === 'РЕАКТ' ? message.replace(/fp/g, 'rt') : message;
  message = value === 'JS' || value === 'ЖС' || value === 'ДЖС' || value === 'ДЖАВАСКРИПТ' || value === 'JAVASCRIPT' ? message.replace(/fp/g, 'js') : message;
  message = value === 'ANGULAR' || value === 'АНГУЛЯР' ? message.replace(/fp/g, 'ag') : message;
  message = value === 'JQUERY' || value === 'ЖКВЕРИ' || value === 'ДЖКВЕРИ' ? message.replace(/fp/g, 'jquery') : message;
  message = value === 'VUE' || value === 'ВУЙ' || value === 'ВУЕ' ? message.replace(/fp/g, 'vue') : message;

  return message;
};

const replaceMention = function(str, resolve) {
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
    UserMessages.findOne({ user_id: userId })
      .then((result) => {
        if (result) {
          message = `@${result.user_name}`;
          resolve(message.toUpperCase());
        }
      });
  }
};


const replaceTextEmoji = function(str) {
  // const myRegexpEmoji = /^:\w+:/g;
  const myRegexpEmoji = /^(:\w+:)|(:\w+.*.\w+:)/g;
  const matchEmoji = myRegexpEmoji.exec(str);
  // console.log(matchEmoji);
  const myObj = {};
  if (matchEmoji) {
    myObj.isExec = true;
    myObj.emoji = matchEmoji[0];
    myObj.message = str.substr(matchEmoji[0].length + 1, str.length);
    return myObj;
  } else {
    myObj.message = str;
    myObj.isExec = false;
    return myObj;
  }
};


function sayText(text, split, maxW, callback) {
  let newLetterArray = [];
  let newArray = [];
  let sendMessage = '';
  text = text.substr(1, text.length);
  replaceMention(text, function(message) {
    text = message;
  });
  setTimeout(function() {
    const newStr = replaceTextEmoji(text);
    let replaced = false;
    let replacedEmoji;
    if (newStr.isExec) {
      replaced = true;
      replacedEmoji = newStr.emoji;
      text = newStr.message;
    }

    if (text.length > maxW) {
      callback('', { message: `, ты просишь слишком много... Я могу сказать не больше ${maxW} символов!` });
      return '';
    }
    if (split) {
      text.match(/.{1,3}/g).forEach(w => { newLetterArray.push(w.split('')) });
    } else {
      text.match(/.{1}/g).forEach(w => { newLetterArray.push(w.split('')) });
    }

    newLetterArray.forEach((item) => {
      const newArray = [];
      item.forEach((itm) => {
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
    }
    callback(newMessage, {});
  }, 500);
}

module.exports = {
  inRow: function(text, callback) {
    sayText(text, true, 12, callback);
  },
  inColumn: function(text, callback) {
    sayText(text, false, 10, callback);
  },
};
