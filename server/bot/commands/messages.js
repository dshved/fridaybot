'use strict';

const messages = [
  {
    messages: ['СКАЖИ'],
    startFrom: true,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').inRow,
  }, {
    messages: ['ГОВОРИ'],
    startFrom: true,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').inColumn,
  }, {
    messages: ['ТЕКСТ '],
    startFrom: true,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').emojiText,
  }, {
    messages: ['РАМКА '],
    startFrom: true,
    channels: ['test', 'friday', 'direct'],
    callback: require('./say').borderText,
  }, {
    messages: ['СКОЛЬКО ПОПУГАЕВ?', 'СКОЛЬКО ПОПУГАЕВ', 'СКОЛЬКО?', 'СКОЛЬКО'],
    startFrom: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').parrotCount,
  }, {
    messages: ['ЕСТЬ КТО ЖИВОЙ?', 'ЕСТЬ КТО ЖИВОЙ', 'ЕСТЬ КТО', 'ЕСТЬ КТО?', 'КТО ЖИВОЙ?', 'КТО ЖИВОЙ'],
    startFrom: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').userCount,
  }, {
    messages: ['LOG'],
    startFrom: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').log,
  }, {
    messages: ['PPM'],
    startFrom: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').ppm,
  }, {
    messages: ['COMMANDS'],
    startFrom: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').commands,
  }, {
    messages: ['CHANGELOG'],
    startFrom: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').changelog,
  },
  // { msg: 'БАШ',  startFrom: false, callback: require('./bash').bash },
  {
    messages: ['ИЛИТА', 'КТО ИЛИТА', 'КТО ИЛИТА?'],
    startFrom: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./statistic').elite,
  },
  {
    messages: ['HOT'],
    startFrom: false,
    channels: ['test', 'friday', 'direct'],
    callback: require('./reddit').redditHot,
  },
  {
    messages: ['RDT'],
    startFrom: false,
    channels: ['test', 'direct',],
    callback: require('./reddit').redditJs,
  },

];


module.exports = { messages };
