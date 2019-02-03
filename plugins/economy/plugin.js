const Plugin = require('../../base/Plugin');

class plugin_Economy extends Plugin {
  constructor(client) {
    super(client, {
      name: 'Economy',
      commands_dir: `${__dirname}/cmds`,
      desc: 'The economy features of the bot'
    })
  }

  run(msg) {
    if (!this.client.db.has(`eco_${msg.channel.guild.id}`))
      this.client.db.set(`eco_${msg.channel.guild.id}`, this.client.config.eco_guild_db);

    if (!this.client.db.has(`eco_${msg.channel.guild.id + msg.author.id}`))
      this.client.db.set(`eco_${msg.channel.guild.id + msg.author.id}`, this.client.config.eco_user_db);

    let { cash, bank, achievements } = this.client.db.get(`eco_${msg.channel.guild.id + msg.author.id}`);

    if (cash + bank >= 1000 && !achievements.includes('reach1k')) {
      achievements.push('reach1k');

      this.client.db.setProp(`eco_${msg.channel.guild.id + msg.author.id}`, 'achievements', achievements);
      this.client.emit('ACHIEVEMENT', msg.author, msg.channel, cash + bank, 'reach1k');
    };
  }
};

module.exports = plugin_Economy;