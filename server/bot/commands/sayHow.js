const getBotEmoji = array => {
  const commandIndex = array.findIndex(command => command === '-e');
  if (commandIndex !== -1) {
    return array[commandIndex + 1];
  }
  return ':fridaybot_new:';
};

const getBotName = array => {
  const commandIndex = array.findIndex(command => command === '-n');
  if (commandIndex !== -1) {
    return array[commandIndex + 1];
  }
  return 'fridaybot';
};

const getBotText = array => {
  const emojiIndex = array.findIndex(command => command === '-e');
  const nameIndex = array.findIndex(command => command === '-n');
  const textIndex = array.findIndex(command => command === '-t');

  if (textIndex !== -1 && nameIndex !== -1 && emojiIndex !== -1) {
    const text = [];
    if (textIndex > emojiIndex && textIndex > nameIndex) {
      for (let i = textIndex + 1; i < array.length; i++) {
        text.push(array[i]);
      }
      return text.join(' ');
    }

    if (textIndex < emojiIndex && textIndex < nameIndex) {
      const n = emojiIndex < nameIndex ? emojiIndex : nameIndex;
      for (let i = textIndex + 1; i < n; i++) {
        text.push(array[i]);
      }
      return text.join(' ');
    }

    if (textIndex > emojiIndex && textIndex < nameIndex) {
      for (let i = textIndex + 1; i < nameIndex; i++) {
        text.push(array[i]);
      }
      return text.join(' ');
    }

    if (textIndex < emojiIndex && textIndex > nameIndex) {
      for (let i = textIndex + 1; i < emojiIndex; i++) {
        text.push(array[i]);
      }
      return text.join(' ');
    }
  }

  return '';
};

const parseMessage = text => {
  const commandsArray = text.split(' ');
  const message = getBotText(commandsArray);
  const attachment = {};
  attachment.username = getBotName(commandsArray);
  attachment.icon_emoji = getBotEmoji(commandsArray);

  return { message, attachment };
};

module.exports = { parseMessage };
