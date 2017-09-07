'use strict';

const BotSettings = require('./../../models/botsetting').BotSettings;
const UserMessages = require('./../../models/usermessage').UserMessages;
const Statistics = require('./../../models/statistics').Statistics;
const Log = require('./../../models/log').Log;
const fs = require('fs');

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
  let messages = '';
  messages += titleMessage;
  for (let i = 0; i < userCounts; i++) {
    messages += `${i + 1}. ${result[i].user_name}: ${result[i]
      .count_messages} ${messagesRus(result[i].count_messages)}\n`;
  }
  messages += `\nВсего живых: ${result.length}`;
  callback(messages, {});
}

function getElite(text, callback) {
  UserMessages.find({ user_name: { $ne: 'slackbot' } })
    .sort([['count_parrots', 'descending']])
    .then(r => {
      let mes = '';
      if (r.length > 10) {
        mes = ':crown:Илита Friday:crown: \n';
        for (let i = 0; i < 10; i++) {
          if (r[i].count_parrots > 0) {
            mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_parrots} ppm\n`;
          }
        }
        UserMessages.findOne({ user_name: 'slackbot' }).then(d => {
          if (d) {
            mes += `----------------------\n:crown: ${d.user_name}: ${d.count_parrots} ppm\n`;
          }

          callback(mes, {});
        });
      } else {
        mes = ':crown:Илита Friday:crown: \n';
        for (let i = 0; i < r.length; i++) {
          mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_parrots} ppm\n`;
        }
        UserMessages.findOne({ user_name: 'slackbot' }).then(d => {
          if (d) {
            mes += `----------------------\n:crown: ${d.user_name}: ${d.count_parrots} ppm\n`;
          }

          callback(mes, {});
        });
      }
    });
}

function getLog(text, callback) {
  Log.aggregate(
    [
      {
        $group: {
          _id: '$command',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ],
    (err, res) => {
      let mes = 'Статистика вызова команд:\n';
      for (let i = 0; i < res.length; i++) {
        mes += `${i + 1}. ${res[i]._id} - ${res[i].count}\n`;
      }
      callback(mes, {});
      mes = '';
    },
  );
}

function getActiveUsers(text, callback) {
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
  const startTimestamp = startOfDay / 1000 - 10800;
  const endTimestamp = endOfDay / 1000 - 10800 + 86400;
  Statistics.aggregate(
    [
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
    ],
    (err, res) => {
      let mes = 'Статистика по сообщениям за 3 дня:\n';
      UserMessages.find({}).then(result => {
        if (result) {
          res.forEach((item, index) => {
            const user = result.filter(el => el.user_id === item._id);

            if (user[0]) {
              mes += `${index + 1}. ${user[0].user_name} - ${item.count}\n`;
            }
          });
          callback(mes, {});
          mes = '';
        }
      });
    },
  );
}

function getPPM(text, callback) {
  UserMessages.aggregate(
    [
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
    ],
    (err, res) => {
      let mes = ':fp: Рейтинг PPM: :fp:\n';
      if (res) {
        if (res.length > 10) {
          for (let i = 0; i < 10; i++) {
            const ppm = Math.round(res[i].ppm * 100) / 100;
            mes += `${i + 1}. ${res[i].user_name} - ${ppm}\n`;
          }
          callback(mes, {});
          mes = '';
        } else {
          for (let i = 0; i < res.length; i++) {
            const ppm = Math.round(res[i].ppm * 100) / 100;
            mes += `${i + 1}. ${res[i].user_name} - ${ppm}\n`;
          }
          callback(mes, {});
          mes = '';
        }
      }
    },
  );
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

function getStatistic(text, callback) {
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
    Statistics.aggregate(
      [
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
          $group: { _id: null, parrot_counts: { $sum: '$parrot_count' } },
        },
      ],
      (err, res) => {
        const parrotCounts = res[0] ? res[0].parrot_counts : 0;
        Statistics.find({
          timestamp: {
            $gte: startTimestamp,
            $lt: endTimestamp,
          },
        }).then(res => {
          if (res) {
            const message = `${dateText} отправлено:\nсообщений - ${res.length}\nпэрротов - ${parrotCounts}`;
            callback(message, {});
          }
        });
      },
    );
  }
}

function getStatisticAll(text, callback) {
  UserMessages.aggregate(
    [
      {
        $group: { _id: null, count_messages: { $sum: '$count_messages' } },
      },
    ],
    (err, res) => {
      BotSettings.findOne().then(data => {
        if (data) {
          const messageCounts = res[0].count_messages
            .toString()
            .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
          const parrotCounts = data.parrot_counts
            .toString()
            .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
          const message = `Всего отправлено:\nсообщений: ${messageCounts} шт.\nпэрротов: ${parrotCounts} шт.`;
          callback(message, {});
        }
      });
    },
  );
}

function whenFriday(text, callback) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let day = now.getDate();

  while (new Date(year, month, day).getDay() != 5) {
    day++;
  }

  const friday = new Date(year, month, day);
  const zero = a => {
    return a < 10 ? `0${a}` : a;
  };

  const millisecToTimeStruct = millisec => {
    if (isNaN(millisec)) {
      return {};
    }
    const days = millisec / (60 * 60 * 24);
    const hours = (days - ~~days) * 24;
    const minutes = (hours - ~~hours) * 60;
    const seconds = (minutes - ~~minutes) * 60;
    return `${~~days} д. ${~~hours} ч. ${~~minutes} м. ${~~seconds} с.`;
  };

  const result = Math.floor(friday / 1000) - Math.floor(now / 1000) - 10800;
  if (result < 0) {
    callback('Сегодня пятница!:fp:', {});
  } else {
    callback(`До пятницы осталось: ${millisecToTimeStruct(result)}`, {});
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
};
