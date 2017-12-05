const BotSettings = require('./../../models/botsetting').BotSettings;
const sayText = require('./../commands/say').sayText;
const getUserCount = require('./userCount');

async function userJoin(data, { channelId }, cb) {
  const settings = await BotSettings.findOne();
  if (settings.user_join.active) {
    const joinMessage = settings.user_join.message
      .replace(/first_name/g, data.user_profile.first_name)
      .replace(/real_name/g, data.user_profile.real_name)
      .replace(/user_name/g, `<@${data.user_profile.name}>`)
      .replace(/channel_name/g, `<#${channelId}>`);
    const countUsers = await getUserCount(channelId);
    if (countUsers) {
      sayText(`:TADA: ${countUsers}`, true, 10, false, callback => {
        const message = callback + joinMessage;
        cb(message);
      });
    } else {
      cb(joinMessage);
    }
  }
}

module.exports = {
  userJoin: (data, botParams, cb) => {
    userJoin(data, botParams, cb);
  },
};
