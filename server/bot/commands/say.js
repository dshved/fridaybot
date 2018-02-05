const request = require('request');
const _ = require('lodash');
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

async function replaceMention(str) {
  const myRegexpChannel = /(#\w+)\|(\w+)/g;
  const myRegexpUser = /@\w+/g;

  const matchUser = [];
  let match;
  while ((match = myRegexpUser.exec(str)) != null) {
    matchUser.push(match[0]);
  }

  const matchChannel = myRegexpChannel.exec(str);

  let message = str;
  if (matchChannel) {
    const channel = matchChannel[1].substr(0, 1) + matchChannel[2];
    message = message.replace(`<${matchChannel[0]}>`, channel);
  }

  if (matchUser.length) {
    for (let i = 0; i < matchUser.length; i++) {
      const userId = matchUser[i].substr(1, matchUser[0].length);
      const result = await UserMessages.findOne({ user_id: userId });
      if (result) {
        message = message.replace(`<${matchUser[i]}>`, `@${result.user_name}`);
        message = message.replace(`${matchUser[i]}`, `@${result.user_name}`);
      }
    }
  }

  return message.toUpperCase();
}

const replaceTextEmoji = str => {
  const regexpEmoji = /^(:[-\w]+:(.|):[-\w]+:)|(:[-\w]+:)/g;
  let matchEmoji = regexpEmoji.exec(str);
  let emoji = [];
  while (matchEmoji != null) {
    emoji.push(matchEmoji[0]);
    matchEmoji = regexpEmoji.exec(str);
  }
  const obj = {};
  if (emoji.length) {
    emoji = emoji[0].split(/(:\w+:)|(:[-\w]+:)/);
    emoji = emoji.filter(n => n !== undefined && n !== '' && n !== ' ');
    const string = emoji.join(' ');
    obj.isExec = true;
    obj.countEmoji = emoji.length;
    obj.emoji = emoji;
    const message = str.substr(string.length, str.length).trim();
    obj.message = message ? message : emoji[1];

    return obj;
  } else {
    obj.message = str;
    obj.countEmoji = 0;
    obj.isExec = false;

    return obj;
  }
};

const getRandomEmoji = cb => {
  request(
    {
      url: `https://slack.com/api/emoji.list?token=${global.BOT_TOKEN}&pretty=1`,
      encoding: null,
    },
    (err, res, body) => {
      const json = JSON.parse(body);
      if (json.ok) {
        const randomEmoji = [];
        const emojiList = Object.keys(json.emoji);
        randomEmoji.push(emojiList[_.random(1, emojiList.length)]);
        randomEmoji.push(emojiList[_.random(1, emojiList.length)]);
        cb(randomEmoji);
      }
    },
  );
};

async function sayText(text, split, maxW, away, callback) {
  text = text.toUpperCase();
  const newLetterArray = [];
  // const newArray = [];
  let sendMessage = '';
  let randomEmoji = false;
  if (~text.indexOf('КАК-НИБУДЬ ') === -1) {
    randomEmoji = true;
    text = text.substr(11);
  }
  if (~text.indexOf('СЛУЧАЙНО ') === -1) {
    randomEmoji = true;
    text = text.substr(9);
  }
  if (~text.indexOf('RANDOM ') === -1) {
    randomEmoji = true;
    text = text.substr(7);
  }
  text = text.substr(0, text.length);
  text = await replaceMention(text);

  setTimeout(() => {
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
        if (randomEmoji) {
          line += ':sp:';
        }
        for (let j = 0; j < newArray.length; j++) {
          line += newArray[j][i];
        }
        if (i === 0) {
          const topLine = line.replace(/:\w\w:/g, ':sp:');
          line = `${topLine}\n${line}\n`;
        } else {
          line += '\n';
        }

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
    if (randomEmoji) {
      getRandomEmoji(emoji => {
        newMessage = newMessage.replace(/:fp:/g, `:${emoji[0]}:`);
        newMessage = newMessage.replace(/:sp:/g, `:${emoji[1]}:`);
        callback(newMessage, {});
      });
    } else {
      callback(newMessage, {});
    }
    return true;
  }, 1000);
}

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
  return true;
};

async function sayBorderText(text, split, maxW, callback) {
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
  userText
    .replace(/&AMP;/g, '&')
    .replace(/&LT;/g, '<')
    .replace(/&GT;/g, '>');
  userText = await replaceMention(userText);
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

    const countLetters = userText.length > 16 ? 16 : userText.length;
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
        const contSpace = countLetters - newArray.length;
        for (let i = 0; i < contSpace; i++) {
          newArray.push(':sp:');
        }
      }
      sendMessage += ':cpl:';
      for (let i = 0; i < newArray.length; i++) {
        if (i === countLetters - 1) {
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
  return true;
}

module.exports = {
  inRow: (text, callback) => {
    sayText(text, true, 20, false, callback);
  },
  inColumn: (text, callback) => {
    sayText(text, false, 20, false, callback);
  },
  emojiText: (text, callback) => {
    sayEmoji(text, false, 300, callback);
  },
  borderText: (text, callback) => {
    sayBorderText(text, false, 300, callback);
  },
  goAway: (text, callback) => {
    sayText(text, true, 20, true, callback);
  },
  sayBorderText,
  sayText,
  replaceTextEmoji,
};
