'use strict';

const messages = [
  { msg: 'СКАЖИ', startFrom: true, callback: require('./say').inRow },
  { msg: 'ГОВОРИ', startFrom: true, callback: require('./say').inColumn },

  { msg: 'ТЕКСТ ', startFrom: true, callback: require('./say').emojiText },
  { msg: 'РАМКА ', startFrom: true, callback: require('./say').borderText },

  { msg: 'СКОЛЬКО ПОПУГАЕВ?', startFrom: false, callback: require('./statistic').parrotCount },
  { msg: 'СКОЛЬКО ПОПУГАЕВ', startFrom: false, callback: require('./statistic').parrotCount },
  { msg: 'СКОЛЬКО?', startFrom: false, callback: require('./statistic').parrotCount },
  { msg: 'СКОЛЬКО', startFrom: false, callback: require('./statistic').parrotCount },

  { msg: 'ЕСТЬ КТО ЖИВОЙ?', startFrom: false, callback: require('./statistic').userCount },
  { msg: 'ЕСТЬ КТО ЖИВОЙ', startFrom: false, callback: require('./statistic').userCount },
  { msg: 'ЕСТЬ КТО', startFrom: false, callback: require('./statistic').userCount },
  { msg: 'ЕСТЬ КТО?', startFrom: false, callback: require('./statistic').userCount },
  { msg: 'КТО ЖИВОЙ?', startFrom: false, callback: require('./statistic').userCount },
  { msg: 'КТО ЖИВОЙ', startFrom: false, callback: require('./statistic').userCount },


  { msg: 'LOG', startFrom: false, callback: require('./statistic').log },

  { msg: 'PPM', startFrom: false, callback: require('./statistic').ppm },

  { msg: 'COMMANDS', startFrom: false, callback: require('./statistic').commands },

  { msg: 'CHANGELOG', startFrom: false, callback: require('./statistic').changelog },

  // { msg: 'БАШ',  startFrom: false, callback: require('./bash').bash },



  { msg: 'ИЛИТА', startFrom: false, callback: require('./statistic').elite },
  { msg: 'КТО ИЛИТА', startFrom: false, callback: require('./statistic').elite },
  { msg: 'КТО ИЛИТА?', startFrom: false, callback: require('./statistic').elite },

];


module.exports = { messages };