const Command = require('../../../base/Command');

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'ping'
    });
  }

  run(msg) {
    msg.channel.createMessage('*Pinging...*')
    .then(m => {
      m.patch({ content: `Pong! Shard **#${msg.channel.guild.shard.id}** latency: \`${msg.channel.guild.shard.latency}ms\`` })
    });
  }
};

module.exports = Ping;