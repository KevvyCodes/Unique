const Command = require('../../../base/Command');
const { readdirSync } = require('fs');

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      desc: 'Shows a list of available commands for your permission level',
      usage: '[command]'
    })
  }

  run(msg, args, level) {
    let _cmd = args[0];
    let { disabledPlugins } = this.client.db.get(`global_${msg.channel.guild.id}`);
    disabledPlugins = disabledPlugins.map(elem => elem.toLowerCase());
    let embed = new this.client.embed()
      .makeAuthor({ name: 'A list of Commands', iconURL: msg.channel.guild.iconURL })
      .makeThumbnail(msg.channel.guild.iconURL)

    if (!_cmd || _cmd && !this.client.commands.has(__cmd.toLowerCase())) {
      let plugins = readdirSync(`${this.client._processDir}/plugins`);
      
      for (var i = 0; i < plugins.length; i++) {
        let plugin = new (require(`${this.client._processDir}/plugins/${plugins[i]}/plugin`))(this.client);

        if (!plugin.commands_dir) continue;

        let commands = this.client.commands.filter(cmd => cmd.plugin === plugin.name && cmd.permlevel <= level && !disabledPlugins.includes(cmd.plugin.toLowerCase()));
        if (commands.length === 0) continue;

        embed.pushField({ name: `» ${plugin.name}`, value: `\`${commands.map(cmd => cmd.name).join('`, `')}\`` })
      }

      embed.fields.length === 0 ? embed.makeDescription('No Commands are allowed for you to use') : null;

      msg.channel.createEmbed(embed);
    };
  }
};

module.exports = Help;