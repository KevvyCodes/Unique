module.exports = {
  name: 'ACHIEVEMENT',
  run: (client, user, channel, balance, achievement) => {
    let { currency } = client.db.get(channel.guild.id);

    if (achievement === 'reach1k') {
      channel.createMessage(`Congratulations **${user.tag}**! You have reached a total balance of
**${currency}${balance.toLocaleString()}**! Which means you will now receive the \`reach1k\` achievement.`);
    }
  }
};