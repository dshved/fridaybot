const axios = require('axios');

async function getUserCount(channel) {
  try {
    const { data: channelInfo } = await axios(
      `https://slack.com/api/channels.info?token=${global.BOT_TOKEN}&channel=${channel}`,
    );
    const { data: usersList } = await axios(
      `https://slack.com/api/users.list?token=${global.BOT_TOKEN}&presence=true`,
    );
    if (channelInfo.ok && usersList.ok) {
      const channelMembers = channelInfo.channel.members;
      const teamMembers = usersList.members;
      const users = teamMembers
        .filter(obj => obj.deleted === false)
        .filter(obj => channelMembers.includes(obj.id));
      return users.length;
    }
    return '';
  } catch (e) {
    return '';
  }
}

module.exports = getUserCount;
