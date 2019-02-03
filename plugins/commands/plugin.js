const Plugin = require('../../base/Plugin');
const { readdirSync } = require('fs');

class plugin_Commands extends Plugin {
  constructor(client) {
    super(client, {
      name: 'Default',
      commands_dir: `${__dirname}/cmds`,
      desc: 'This plugin is responsible for the commands you are using right now. If this was disabled, the bot will be online only'
    });
  }

  run() {
    let plugins = readdirSync(`${this.client._processDir}/plugins`);

    for (var i = 0; i < plugins.length; i++) {
      let plugin = new (require(`${this.client._processDir}/plugins/${plugins[i]}/plugin.js`))(this.client);
      
      if (plugin.disabled) continue;
      if (!plugin.commands_dir) continue;

      // Cache commands here
      let commands = readdirSync(plugin.commands_dir);

      for (var c = 0; c < commands.length; c++) {
        let command = new (require(`${this.client._processDir}/plugins/${plugins[i]}/cmds/${commands[c]}`))(this.client);
        command.plugin = plugin.name;

        this.client.customLog(`COMMANDS PLUGIN`, 'green', `Cached: ${command.name} command From Plugin: ${plugin.name}`);
        this.client.commands.set(command.name, command);
      };
    };
  }
};

module.exports = plugin_Commands;