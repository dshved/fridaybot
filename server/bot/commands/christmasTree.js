const { replaceTextEmoji } = require('./say');
const template = require('./christmasTreeTemplate');

const getChristmasTree = (text, callback) => {
  const result = replaceTextEmoji(text);
  let message = template;

  if (result.isExec) {
    switch (result.countEmoji) {
      case 1:
        message = message.replace(/:heart:/g, result.emoji[0]);
        break;
      case 2:
        message = message
          .replace(/:heart:/g, result.emoji[0])
          .replace(/:lemon:/g, result.emoji[1]);
        break;
      default:
        break;
    }
    callback(message, {});
  } else {
    callback(message, {});
  }
};

module.exports = {
  getChristmasTree: (text, callback) => {
    getChristmasTree(text, callback);
  },
};
