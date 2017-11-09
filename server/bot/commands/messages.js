'use strict';

const messages = [
  {
    messages: ['СКАЖИ ', 'SAY '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').inRow,
  },
  {
    messages: ['ГОВОРИ ', 'SPEAK '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').inColumn,
  },
  {
    messages: ['ТЕКСТ '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').emojiText,
  },
  {
    messages: ['РАМКА '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').borderText,
  },
  {
    messages: ['СКОЛЬКО ПОПУГАЕВ?', 'СКОЛЬКО ПОПУГАЕВ', 'СКОЛЬКО?', 'СКОЛЬКО'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').parrotCount,
  },
  {
    messages: ['СПАМЕРЫ', 'КТО СПАМЕРЫ', 'КТО СПАМЕРЫ?', 'ТОП СПАМЕРОВ', 'ТОП'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').userCount,
  },
  {
    messages: ['LOG'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').log,
  },
  {
    messages: ['PPM'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').ppm,
  },
  {
    messages: ['COMMANDS', 'HELP'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').commands,
  },
  {
    messages: ['CHANGELOG'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').changelog,
  },
  {
    messages: ['БАШ', 'BASH', 'БАШОРГ'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./bash'),
  },
  {
    messages: ['БАШ ', 'BASH ', 'БАШОРГ '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./bash'),
  },
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
    messages: ['REDDIT '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct', 'general'],
    callback: require('./reddit').redditSub,
  },
  {
    messages: ['REDDIT'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct', 'general'],
    callback: require('./reddit').redditSub,
  },
  {
    messages: [
      'МИЛИЦИЯ ',
      'МИЛИЦИЮ ВЫЗОВУ ',
      'ПОЛИЦИЯ ',
      'ГОСПОДИН ПОЛИЦЕЙСКИЙ ',
      'ОМОН ',
      'OMON ',
    ],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./police').getPolice,
  },
  {
    messages: ['СТАТИСТИКА ЗА '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').statistic,
  },
  {
    messages: ['СТАТИСТИКА'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').statisticAll,
  },
  {
    messages: [
      'ЕСТЬ КТО ЖИВОЙ?',
      'ЕСТЬ КТО ЖИВОЙ',
      'ЕСТЬ КТО',
      'ЕСТЬ КТО?',
      'КТО ЖИВОЙ?',
      'КТО ЖИВОЙ',
    ],
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
  {
    messages: ['DEVLIFE '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'direct', 'friday'],
    callback: require('./devlife').devlifeSearch,
  },
  {
    messages: ['DEVLIFE', 'DEVLIFE RANDOM'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'direct', 'friday'],
    callback: require('./devlife').devlifeRandom,
  },
  {
    messages: ['DEVLIFE HOT'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'direct', 'friday'],
    callback: require('./devlife').devlifeHot,
  },
  {
    messages: ['RANDOM COMIC'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'direct', 'friday'],
    callback: require('./randomcomic').randomComic,
  },
  {
    messages: [
      'КОГДА ПЯТНИЦА',
      'КОГДА ПЯТНИЦА?',
      'КОГДА УЖЕ ПЯТНИЦА',
      'КОГДА УЖЕ ПЯТНИЦА?',
      'СКОРО ПЯТНИЦА',
      'СКОРО ПЯТНИЦА?',
      'СКОРО УЖЕ ПЯТНИЦА',
      'СКОРО УЖЕ ПЯТНИЦА?',
    ],
    startFrom: false,
    entrance: false,
    channels: ['test', 'direct', 'friday'],
    callback: require('./statistic').friday,
  },
  {
    messages: ['УЕЗЖАЙ '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').goAway,
  },
  {
    messages: ['GIPHY '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./giphy').getGiphy,
  },
  {
    messages: ['GIPHY'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./giphy').getGiphy,
  },
  {
    messages: ['ФРАЙДАЧ ПОЗНАВАТЕЛЬНЫЙ'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./wikipedia').wiki,
  },
  {
    messages: ['ДОНАТЕРЫ', 'НЯШИ'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./donate'),
  },
  {
    messages: ['FACE '],
    startFrom: true,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./faceapp').drawCombo,
  },
  {
    messages: ['FACE LIST'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./faceapp').getFilterList,
  },
  {
    messages: ['ОНЛАЙН', 'КТО ОНЛАЙН', 'КТО ОНЛАЙН?', 'ONLINE'],
    startFrom: false,
    entrance: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').online,
  },
];

module.exports = { messages };
