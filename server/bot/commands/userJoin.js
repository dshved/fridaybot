const request = require('request');
const BotSettings = require('./../../models/botsetting').BotSettings;
const sayText = require('./../commands/say').sayText;

async function userJoin(data, botParams, cb) {
  const settings = await BotSettings.findOne();
  if (settings.user_join.active) {
    const joinMessage = settings.user_join.message
      .replace(/first_name/g, data.user_profile.first_name)
      .replace(/real_name/g, data.user_profile.real_name)
      .replace(/user_name/g, `<@${data.user_profile.name}>`)
      .replace(/channel_name/g, `<#${botParams.channelId}>`);

    request(
      {
        url: `https://slack.com/api/channels.info?token=${global.BOT_TOKEN}&channel=${botParams.channelId}`,
        encoding: null,
      },
      (err, res, body) => {
        const json = JSON.parse(body);
        if (json.ok) {
          const countUsers = json.channel.members.length;
          sayText(`:TADA: ${countUsers}`, true, 10, false, callback => {
            const message = callback + joinMessage;
            cb(message);
          });
        } else {
          cb(joinMessage);
        }
      },
    );
  }
}

module.exports = {
  userJoin: function(data, botParams, cb) {
    userJoin(data, botParams, cb);
  },
};
