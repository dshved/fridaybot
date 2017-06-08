'use strict';

const messages = [
  {
    messages: ['СКАЖИ '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').inRow,
  }, {
    messages: ['ГОВОРИ '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').inColumn,
  }, {
    messages: ['ТЕКСТ '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').emojiText,
  }, {
    messages: ['РАМКА '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').borderText,
  }, {
    messages: ['СКОЛЬКО ПОПУГАЕВ?', 'СКОЛЬКО ПОПУГАЕВ', 'СКОЛЬКО?', 'СКОЛЬКО'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').parrotCount,
  }, {
    messages: ['СПАМЕРЫ', 'КТО СПАМЕРЫ', 'КТО СПАМЕРЫ?', 'ТОП СПАМЕРОВ', 'ТОП'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').userCount,
  }, {
    messages: ['LOG'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').log,
  }, {
    messages: ['PPM'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').ppm,
  }, {
    messages: ['COMMANDS', 'HELP'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').commands,
  }, {
    messages: ['CHANGELOG'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').changelog,
  },
  // { msg: 'БАШ',  startFrom: false, callback: require('./bash').bash },
  {
    messages: ['ИЛИТА', 'КТО ИЛИТА', 'КТО ИЛИТА?'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').elite,
  },
  {
    messages: ['HOT'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct', 'general'],
    callback: require('./reddit').redditHot,
  },
  {
    messages: ['RDT'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'direct', 'friday'],
    callback: require('./reddit').redditJs,
  },
  {
    messages: ['МИЛИЦИЯ', 'МИЛИЦИЮ ВЫЗОВУ', 'ПОЛИЦИЯ', 'ГОСПОДИН ПОЛИЦЕЙСКИЙ', 'ОМОН'],
    startFrom: false,
    entrance: true,
    channels: ['test', 'friday', 'direct'],
    callback: require('./police').police,
  },
  {
    messages: ['СТАТИСТИКА ЗА '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').statistic,
  },
  {
    messages: ['ЕСТЬ КТО ЖИВОЙ?', 'ЕСТЬ КТО ЖИВОЙ', 'ЕСТЬ КТО', 'ЕСТЬ КТО?', 'КТО ЖИВОЙ?', 'КТО ЖИВОЙ'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').activeUsers,
  },
  {
    messages: ['ПИКАБУ', 'PIKABU', 'PIKABU HOT', 'ПИКАБУ ГОРЯЧЕЕ'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'direct', 'friday'],
    callback: require('./pikabu').pikabuHot,
  },
  {
    messages: ['PIKABU BEST', 'ПИКАБУ ЛУЧШЕЕ'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'direct', 'friday'],
    callback: require('./pikabu').pikabuBest,
  },
  {
    messages: ['PIKABU NEW', 'ПИКАБУ СВЕЖЕЕ'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'direct', 'friday'],
    callback: require('./pikabu').pikabuNew,
  },

];


module.exports = { messages };
