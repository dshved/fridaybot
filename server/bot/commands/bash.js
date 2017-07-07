'use strict';

function getBashPost(text, callback) {
  callback('', {});
}

module.exports = {
  bash: function(text, callback) {
    getBashPost(text, callback);
  },
};
