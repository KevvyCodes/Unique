const Command = require('../../../base/Command');
const { readdirSync } = require('fs');

class Plugin extends Command {
  constructor(client) {
    super(client, {
      name: 'plugin',
      aliases: ['module'],
      desc: 'Enable or disable plugins for the guild',
      usage: '<enable|disable|list> <plugin>'
    })
  }

  run(msg, args, level) {
    let key = args[0];
    let keys = ['enable', 'disable', 'list'];

    let { disabledPlugins } = this.client.db.get(`global_${msg.channel.guild.id}`);
    disabledPlugins = disabledPlugins.map(elem => elem.toLowerCase());

    if (!key || key && !keys.includes(key.toLowerCase()))
      return msg.channel.createMessage(`Please choose from the following keys: **${keys.join('**, **')}**`)

    key = args[0].toLowerCase();

    let plugins = readdirSync(`${this.client._processDir}/plugins`);

    switch(key) {
      case 'list': {
        let embed = new this.client.embed()
          .makeAuthor({ name: 'List of plugins', iconURL: msg.channel.guild.iconURL });
        for (var i = 0; i < plugins.length; i++) {
          let plugin = new (require(`${this.client._processDir}/plugins/${plugins[i]}/plugin`))(this.client);

          if (plugin.name.toLowerCase() === 'default' || plugin.name.toLowerCase() === 'events') continue;
          let status;

          if (plugin.disabled || this.client.disabledPlugins.includes(plugin.name.toLowerCase()) || disabledPlugins.includes(plugin.name.toLowerCase()))
            status = '<a:plexiDnd:478869699455746049>';
          else
            status = '<a:plexiOnline:478870259944783873>'

          embed.pushField({ name: `» ${plugin.name} ${status}`, value: plugin.desc });
        }

        msg.channel.createEmbed(embed);
        break;
      }

      case 'enable': {
        if (level < 4)
          return msg.channel.createMessage('You cannot use this key! This is for server administrators only!');

        let plugin = args[1];
        let _plugins = [];

        if (plugin && plugin.toLowerCase() === 'default' || plugin && plugin.toLowerCase() === 'events' || plugin && plugin.toLowerCase() === 'commands')
          return msg.channel.createMessage('You can\'t touch these plugins!');

        for (var i = 0; i < plugins.length; i++) {
          let _plugin = new (require(`${this.client._processDir}/plugins/${plugins[i]}/plugin`))(this.client);

          _plugins.push(_plugin);
        };

        if (!plugin || plugin && !_plugins.map(plug => plug.name.toLowerCase()).includes(plugin.toLowerCase()))
          return msg.channel.createMessage('Invalid plugin!');
        else {
          let index = disabledPlugins.indexOf(plugin.toLowerCase())

          if (index > -1) {
            disabledPlugins.splice(index, 1);
          }

          this.client.db.setProp(`global_${msg.channel.guild.id}`, 'disabledPlugins', disabledPlugins);

          msg.channel.createMessage(`I have successfully enabled the **${_plugins.filter(plug => plug.name.toLowerCase() === plugin.toLowerCase())[0].name}** plugin`)
        };

        break;
      }

      case 'disable': {
        if (level < 4)
          return msg.channel.createMessage('You cannot use this key! This is for server administrators only!');

        let plugin = args[1];
        let _plugins = [];

        if (plugin && plugin.toLowerCase() === 'default' || plugin && plugin.toLowerCase() === 'events' || plugin && plugin.toLowerCase() === 'commands')
          return msg.channel.createMessage('You can\'t touch these plugins!');

        for (var i = 0; i < plugins.length; i++) {
          let _plugin = new (require(`${this.client._processDir}/plugins/${plugins[i]}/plugin`))(this.client);

          _plugins.push(_plugin);
        };

        if (!plugin || plugin && !_plugins.map(plug => plug.name.toLowerCase()).includes(plugin.toLowerCase()))
          return msg.channel.createMessage('Invalid plugin!');
        else {
          disabledPlugins.push(plugin.toLowerCase())

          this.client.db.setProp(`global_${msg.channel.guild.id}`, 'disabledPlugins', disabledPlugins);

          msg.channel.createMessage(`I have successfully disabled the **${_plugins.filter(plug => plug.name.toLowerCase() === plugin.toLowerCase())[0].name}** plugin`)
        };

        break;
      }
    };
  }
};

module.exports = Plugin;