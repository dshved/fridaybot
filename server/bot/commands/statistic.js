const BotSettings = require('./../../models/botsetting').BotSettings;
const UserMessages = require('./../../models/usermessage').UserMessages;
const Statistics = require('./../../models/statistics').Statistics;
const Log = require('./../../models/log').Log;
const { random } = require('lodash');
const axios = require('axios');

const commandsURL =
  'https://github.com/dshved/fridaybot/blob/master/COMMANDS.md';
const changelogURL =
  'https://github.com/dshved/fridaybot/blob/master/CHANGELOG.md';

const messagesRus = num => {
  num = Math.abs(num);
  num %= 100;
  if (num >= 5 && num <= 20) {
    return 'сообщений';
  }
  num %= 10;
  if (num === 1) {
    return 'сообщение';
  }
  if (num >= 2 && num <= 4) {
    return 'сообщения';
  }
  return 'сообщений';
};

function whenDayOfWeek(day) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let today = now.getDate();

  while (new Date(year, month, today).getDay() !== day) {
    today++;
  }

  const breakfast = new Date(year, month, today);
  const result = Math.floor(breakfast / 1000) - Math.floor(now / 1000);
  return result;
}

async function getParrotCount(text, callback) {
  try {
    const result = await BotSettings.findOne();
    const parrotCounts = result.parrot_counts
      .toString()
      .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    callback(`Всего отправлено: ${parrotCounts} шт.`, {});
  } catch (error) {
    callback('', { message: 'что то пошло не так :sad_parrot:' });
  }
}

async function getUserCount(text, callback) {
  const result = await UserMessages.find({ count_messages: { $gt: 1 } }).sort([
    ['count_messages', 'descending'],
  ]);
  const userCounts = result.length > 10 ? 10 : result.length;
  const titleMessage =
    userCounts === 10
      ? 'TOP 10: \n'
      : 'Вот люди, которые подают признаки жизни: \n';
  let message = '';
  message += titleMessage;
  for (let i = 0; i < userCounts; i++) {
    message += `${i + 1}. ${result[i].user_name}: ${result[i]
      .count_messages} ${messagesRus(result[i].count_messages)}\n`;
  }
  message += `\nВсего живых: ${result.length}`;
  callback(message, {});
}

async function getElite(text, callback) {
  const result = await UserMessages.find({}).sort([
    ['count_parrots', 'descending'],
  ]);
  const slackbot = result.filter(item => item.user_name === 'slackbot');
  const filtred = result.filter(item => item.user_name !== 'slackbot');
  const countUsers = filtred.length > 10 ? 10 : filtred.length;

  let message = '';
  message = ':crown:Илита Friday:crown: \n';
  for (let i = 0; i < countUsers; i++) {
    if (filtred[i].count_parrots > 0) {
      message += `${i + 1}. ${filtred[i].user_name}: ${filtred[i]
        .count_parrots} parrots\n`;
    }
  }

  message += `----------------------\n:crown: ${slackbot[0]
    .user_name}: ${slackbot[0].count_parrots} parrots\n`;
  callback(message, {});
}

async function getLog(text, callback) {
  const result = await Log.aggregate([
    {
      $group: {
        _id: '$command',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  let message = 'Статистика вызова команд:\n';
  for (let i = 0; i < result.length; i++) {
    message += `${i + 1}. ${result[i]._id} - ${result[i].count}\n`;
  }
  callback(message, {});
}

async function getActiveUsers(text, callback) {
  const date = new Date();
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 2,
  );
  const endOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const startTimestamp = startOfDay / 1000;
  const endTimestamp = endOfDay / 1000 - 10800 + 86400;
  const statistics = await Statistics.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startTimestamp,
          $lt: endTimestamp,
        },
        event_type: 'user_message',
      },
    },
    {
      $group: {
        _id: '$user_id',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const userMessages = await UserMessages.find({});

  let message = 'Статистика по сообщениям за 3 дня:\n';
  let totalMessages = 0;

  statistics.forEach((item, index) => {
    const user = userMessages.filter(el => el.user_id === item._id);

    if (user[0]) {
      totalMessages += item.count;
      message += `${index + 1}. ${user[0].user_name} - ${item.count}\n`;
    }
  });
  message += `\n Всего сообщений: ${totalMessages}`;
  callback(message, {});
  message = '';
}

async function getPPM(text, callback) {
  const result = await UserMessages.aggregate([
    {
      $project: {
        user_name: 1,
        ppm: {
          $divide: ['$count_parrots', '$count_messages'],
        },
      },
    },
    {
      $sort: { ppm: -1 },
    },
  ]);

  let message = ':fp: Рейтинг PPM: :fp:\n';
  const countUsers = result.length > 10 ? 10 : result.length;

  for (let i = 0; i < countUsers; i++) {
    const ppm = Math.round(result[i].ppm * 100) / 100;
    message += `${i + 1}. ${result[i].user_name} - ${ppm}\n`;
  }
  callback(message, {});
  message = '';
}

function getCommands(text, callback) {
  callback(commandsURL, {});
}

function getChangelog(text, callback) {
  callback(changelogURL, {});
}

function parseDate(str) {
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : null;
}

async function getStatistic(msg, callback) {
  const text = msg.toUpperCase();
  let dateOffset;
  let dateText = 0;
  let date;

  if (text === 'СЕГОДНЯ') {
    dateOffset = 0;
    dateText = 'Сегодня';
    date = new Date();
  } else if (text === 'ВЧЕРА') {
    dateOffset = 1;
    dateText = 'Вчера';
    date = new Date();
  } else if (parseDate(text)) {
    if (new Date(parseDate(text)) > new Date()) {
      callback('Мне не известно, что будет в будущем!', {});
    } else {
      date = new Date(parseDate(text));
      dateOffset = 0;
      dateText = parseDate(text);
    }
  } else {
    callback(
      'Повторите команду с указанием даты в формате `DD/MM/YYYY` или ключевых слов `сегодня`, `вчера`',
      {},
    );
  }
  if (date) {
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - dateOffset,
    );
    const startTimestamp = startOfDay / 1000 - 10800;
    const endTimestamp = startTimestamp + 86400;

    const result = await Statistics.find({
      timestamp: {
        $gte: startTimestamp,
        $lt: endTimestamp,
      },
      event_type: 'user_message',
    });

    const messageCount = result.length;
    let parrotCount = 0;

    result.forEach(item => (parrotCount += item.parrot_count));
    const message = `${dateText} отправлено:\nсообщений - ${messageCount}\nпэрротов - ${parrotCount}`;

    callback(message, {});
  }
}

async function getStatisticAll(text, callback) {
  const userMessages = await UserMessages.aggregate([
    {
      $group: { _id: null, count_messages: { $sum: '$count_messages' } },
    },
  ]);

  const botSettings = await BotSettings.findOne();

  const messageCounts = userMessages[0].count_messages
    .toString()
    .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');

  const parrotCounts = botSettings.parrot_counts
    .toString()
    .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');

  const message = `Всего отправлено:\nсообщений: ${messageCounts} шт.\nпэрротов: ${parrotCounts} шт.`;
  callback(message, {});
}

function millisecToTimeStruct(millisec) {
  if (isNaN(millisec)) {
    return {};
  }
  const days = millisec / (60 * 60 * 24);
  const hours = (days - ~~days) * 24;
  const minutes = (hours - ~~hours) * 60;
  const seconds = (minutes - ~~minutes) * 60;
  return `${~~days} д. ${~~hours} ч. ${~~minutes} м. ${~~seconds} с.`;
}

async function whenFriday(text, callback) {
  const result = whenDayOfWeek(5);
  const attachment = {};
  const imageUrl =
    result < 0
      ? 'http://memok.net/uploads/2014/01/26/52e4f0c4c579a.jpg'
      : 'https://i.ytimg.com/vi/hqcWAPh-pvM/maxresdefault.jpg';

  attachment.username = 'fridaybot';
  attachment.icon_emoji = ':fridaybot_new:';
  attachment.attachments = [
    {
      fallback: '',
      image_url: imageUrl,
    },
  ];
  if (random(10) === 10) {
    attachment.attachments = [
      {
        fallback: '',
        image_url:
          'http://www.biography-life.ru/uploads/posts/2016-06/1466271162_brando2.jpg',
      },
    ];
    callback(
      'Ты приходишь и просишь у меня сказать тебе когда пятница, но ты просишь без уважения, не предлагаешь мне дружбу, даже не называешь меня "Мистер Бот" вместо этого ты приходишь в мой чат и просишь меня сказать тебе когда пятница.',
      {},
      attachment,
    );
  } else {
    if (result < 0) {
      callback('Сегодня пятница!:fp:', {}, attachment);
    }
    callback(
      `До пятницы осталось: ${millisecToTimeStruct(result)}`,
      {},
      attachment,
    );
  }
}

async function getOnlineUsers(text, callback, mes, { channel }) {
  try {
    const { data: channelInfo } = await axios(
      `https://slack.com/api/channels.info?token=${global.BOT_TOKEN}&channel=${channel}`,
    );
    const { data: usersList } = await axios(
      `https://slack.com/api/users.list?token=${global.BOT_TOKEN}&presence=true`,
    );
    if (channelInfo.ok && usersList.ok) {
      const channelMembers = channelInfo.channel.members;
      const teamMembers = usersList.members;
      const onlineUsers = teamMembers
        .filter(obj => obj.presence === 'active')
        .filter(obj => channelMembers.includes(obj.id));
      callback(`Всего онлайн: ${onlineUsers.length}`, {});
    } else {
      callback('Что-то пошло не так (', {});
    }
  } catch (e) {
    callback('Что-то пошло не так (', {});
  }
}

function whenDay(week, text, callback) {
  const weeksList = [
    ['воскресенье', 'воскресенья'],
    ['понедельник', 'понедельника'],
    ['вторник', 'вторника'],
    ['среда', 'среды'],
    ['четверг', 'четверга'],
    ['пятница', 'пятницы'],
    ['суббота', 'субботы'],
  ];

  const result = whenDayOfWeek(week);

  if (result < 0) {
    return callback(`Сегодня ${weeksList[week][0]}!`, {});
  }
  return callback(
    `До ${weeksList[week][1]} осталось ${millisecToTimeStruct(result)}`,
    {},
  );
}

function whenNewYear(text, callback) {
  const now = new Date();
  const year = now.getFullYear();
  const day = now.getDate();
  const month = now.getMonth();
  if (day === 1 && month === 0) {
    return callback(':tada: Сегодня Новый Год!:tada:', {});
  }
  const newYear = new Date(year + 1, 0, 1);
  const result = Math.floor(newYear / 1000) - Math.floor(now / 1000);
  return callback(
    `До Нового Года осталось ${millisecToTimeStruct(result)} :sad_parrot:`,
    {},
  );
}

function whenBreakfast(text, callback) {
  const result = whenDayOfWeek(4);
  const attachment = {};
  const imageUrl =
    result < 0
      ? 'https://fridaybot.tk/images/breakfast_today.jpg'
      : 'https://fridaybot.tk/images/breakfast_coming_soon.jpg';

  attachment.username = 'fridaybot';
  attachment.icon_emoji = ':fridaybot_new:';
  attachment.attachments = [
    {
      fallback: '',
      image_url: imageUrl,
    },
  ];

  if (result < 0) {
    callback('Сегодня завтрак! :egg:', {}, attachment);
  } else {
    callback(
      `До завтрака осталось: ${millisecToTimeStruct(result)}`,
      {},
      attachment,
    );
  }
}

function whenDrinkUp(text, callback) {
  const result = 1517328000 - Math.floor(new Date().getTime() / 1000);
  const attachment = {};
  attachment.username = 'fridaybot';
  attachment.icon_emoji = ':fridaybot_new:';

  if (result < 0 && result < -18000) {
    callback('Я хз если честно', {}, attachment);
  } else if (result < 0) {
    callback('Уже идет :ehsukablya:', {}, attachment);
  } else {
    callback(
      `До дринкапа осталось: ${millisecToTimeStruct(result)}`,
      {},
      attachment,
    );
  }
}

module.exports = {
  parrotCount: (text, callback) => {
    getParrotCount(text, callback);
  },
  userCount: (text, callback) => {
    getUserCount(text, callback);
  },
  elite: (text, callback) => {
    getElite(text, callback);
  },
  log: (text, callback) => {
    getLog(text, callback);
  },
  ppm: (text, callback) => {
    getPPM(text, callback);
  },
  commands: (text, callback) => {
    getCommands(text, callback);
  },
  changelog: (text, callback) => {
    getChangelog(text, callback);
  },
  statistic: (text, callback) => {
    getStatistic(text, callback);
  },
  statisticAll: (text, callback) => {
    getStatisticAll(text, callback);
  },
  activeUsers: (text, callback) => {
    getActiveUsers(text, callback);
  },
  friday: (text, callback) => {
    whenFriday(text, callback);
  },
  online: (text, callback, mes, data) => {
    getOnlineUsers(text, callback, mes, data);
  },
  whenSunday: (text, callback) => {
    whenDay(0, text, callback);
  },
  whenMonday: (text, callback) => {
    whenDay(1, text, callback);
  },
  whenTuesday: (text, callback) => {
    whenDay(2, text, callback);
  },
  whenWednesday: (text, callback) => {
    whenDay(3, text, callback);
  },
  whenThursday: (text, callback) => {
    whenDay(4, text, callback);
  },
  whenSaturday: (text, callback) => {
    whenDay(6, text, callback);
  },
  whenNewYear: (text, callback) => {
    whenNewYear(text, callback);
  },
  whenBreakfast,
  whenDrinkUp,
};
/* eslint-enable */
