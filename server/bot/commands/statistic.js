'use strict';

const BotSettings = require('./../../models/botsetting').BotSettings;
const UserMessages = require('./../../models/usermessage').UserMessages;
const Statistics = require('./../../models/statistics').Statistics;
const Log = require('./../../models/log').Log;
const fs = require('fs');

const commandsURL = 'https://github.com/dshved/fridaybot/blob/master/COMMANDS.md';
const changelogURL = 'https://github.com/dshved/fridaybot/blob/master/CHANGELOG.md';


const messagesRus = (num) => {
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

function getParrotCount(text, callback) {
  BotSettings.findOne().then((r) => {
    if (r) {
      callback(`Всего отправлено: ${r.parrot_counts} шт.`, {});
    } else {
      callback('', { message: 'что то пошло не так :sad_parrot:' });
    }
  });
}

function getUserCount(text, callback) {
  UserMessages.find({ count_messages: { $gt: 1 } }).sort([
      ['count_messages', 'descending'],
    ])
    .then((r) => {
      let mes = '';
      if (r.length > 10) {
        mes = 'TOP 10: \n';
        for (let i = 0; i < 10; i++) {
          mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_messages} ${messagesRus(r[i].count_messages)}\n`;
        }
        mes += `\nВсего живых: ${r.length}`;
        callback(mes, {});
      } else {
        mes = 'Вот люди, которые подают признаки жизни: \n';
        for (let i = 0; i < r.length; i++) {
          mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_messages} ${messagesRus(r[i].count_messages)}\n`;
        }
        mes += `\nВсего живых: ${r.length}`;
        callback(mes, {});
      }
    });
}

function getElite(text, callback) {
  UserMessages.find({ user_name: { $ne: 'slackbot' } }).sort([
      ['count_parrots', 'descending'],
    ])
    .then((r) => {
      let mes = '';
      if (r.length > 10) {
        mes = ':crown:Илита Friday:crown: \n';
        for (let i = 0; i < 10; i++) {
          if (r[i].count_parrots > 0) {
            mes += `${i + 1}. ${r[i].user_name}: ${r[i].count_parrots} ppm\n`;
          }
        }
        UserMessages.findOne({ user_name: 'slackbot' })
          .then((d) => {
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
        UserMessages.findOne({ user_name: 'slackbot' })
          .then((d) => {
            if (d) {
              mes += `----------------------\n:crown: ${d.user_name}: ${d.count_parrots} ppm\n`;
            }

            callback(mes, {});
          });
      }
    });
}

function getLog(text, callback) {
  Log.aggregate([{
      $group: {
        _id: '$command',
        count: { $sum: 1 },
      },
    }, {
      $sort: { count: -1 },
    }, ],
    (err, res) => {
      let mes = 'Статистика вызова команд:\n';
      for (let i = 0; i < res.length; i++) {
        mes += `${i + 1}. ${res[i]._id} - ${res[i].count}\n`;
      }
      callback(mes, {});
      mes = '';
    }
  );
}

function getConversion(text, callback) {
  const date = new Date();
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 3);
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startTimestamp = ((startOfDay / 1000) - 10800);
  const endTimestamp = ((endOfDay / 1000) - 10800) + 86400;
  Statistics.aggregate(
    [{
      $match: {
        'timestamp': {
          '$gte': startTimestamp,
          '$lt': endTimestamp,
        },
        event_type: 'user_message',
      },
    }, {
      $group: {
        _id: '$user_id',
        count: { $sum: 1 },
      },
    }, {
      $sort: { count: -1 },
    }, ],
    (err, res) => {
      let mes = 'Статистика по сообщениям за 3 дня:\n';
      let messages = [];
      for (let i = 0; i < res.length; i++) {
        UserMessages.findOne({ user_id: res[i]._id }).then(response => {
          if (response) {
            messages.push({item: i + 1, user_name: response.user_name, count: res[i].count});
            // mes += `${i + 1}. ${response.user_name} - ${res[i].count}\n`;
          }
        });
      }
      setTimeout(() => {
        function sortItem(a,b) {
          return a.item - b.item;
        }
        const newMessages = messages.sort(sortItem);
        newMessages.forEach(item => {
          mes += `${item.item}. ${item.user_name} - ${item.count}\n`;
        });
        callback(mes, {});
        mes = '';
      }, 2000);
    }
  );
}


function getPPM(text, callback) {
  UserMessages.aggregate(
    [{
      $project: {
        user_name: 1,
        ppm: {
          $divide: ['$count_parrots', '$count_messages'],
        },
      },
    }, {
      $sort: { ppm: -1 },
    }, ],
    (err, res) => {
      let mes = ':fp: Рейтинг PPM: :fp:\n';
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
  return (m) ? `${m[3]}/${m[2]}/${m[1]}` : null;
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
    callback('Повторите команду с указанием даты в формате `DD/MM/YYYY` или ключевых слов `сегодня`, `вчера`', {});
  }
  if (date) {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dateOffset);
    const startTimestamp = (startOfDay / 1000) - 10800;
    const endTimestamp = startTimestamp + 86400;
    Statistics.aggregate(
      [{
        $match: {
          'timestamp': {
            '$gte': startTimestamp,
            '$lt': endTimestamp,
          },
          event_type: 'user_message',
        },
      }, {
        $group: { _id: null, parrot_counts: { $sum: '$parrot_count' } },
      }, ],
      (err, res) => {
        const parrotCounts = res[0] ? res[0].parrot_counts : 0;
        Statistics.find({
          'timestamp': {
            '$gte': startTimestamp,
            '$lt': endTimestamp,
          },
        }).then(res => {
          if (res) {
            const message = `${dateText} отправлено:\nсообщений - ${res.length}\nпэрротов - ${parrotCounts}`;
            callback(message, {})
          }
        });
      });
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
  conversion: (text, callback) => {
    getConversion(text, callback);
  },
};
