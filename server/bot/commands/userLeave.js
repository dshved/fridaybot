const BotSettings = require('./../../models/botsetting').BotSettings;
const UserMessages = require('./../../models/usermessage').UserMessages;
const sayText = require('./../commands/say').sayText;
const getUserCount = require('./userCount');

async function userLeave(data, { channelId }, cb) {
  const settings = await BotSettings.findOne();
  const userInfo = await UserMessages.findOne({ user_id: data.user });

  if (settings.user_leave.active) {
    const leaveMessage = settings.user_leave.message
      .replace(/first_name/g, data.user_profile.first_name)
      .replace(/real_name/g, data.user_profile.real_name)
      .replace(/name/g, `<@${data.user_profile.name}>`);
    const countUsers = await getUserCount(channelId);
    if (countUsers) {
      sayText(`:RAGE: ${countUsers}`, true, 10, false, callback => {
        const message = callback + leaveMessage;
        let userStatistics = '';
        const countMessages = userInfo.count_messages;
        const countParrots = userInfo.count_parrots;
        userStatistics = `\nПользователем было отправлено:\nсообщений - ${countMessages}\nпэрротов - ${countParrots}`;
        UserMessages.remove({ user_id: data.user }).then();
        cb(message + userStatistics);
      });
    } else {
      cb(leaveMessage);
    }
  }
}

module.exports = {
  userLeave: (data, botParams, cb) => {
    userLeave(data, botParams, cb);
  },
};
