const { readdirSync } = require('fs');

module.exports = {
  name: 'MESSAGE_CREATE',
  run: (client, msg) => {
    if (!msg.channel.guild || msg.author.bot) return;

    if (!client.db.has(`global_${msg.channel.guild.id}`)) {
      client.db.set(`global_${msg.channel.guild.id}`, client.config.global_guild_db)
    };

    let plugins = readdirSync(`${client._processDir}/plugins`);
    let args = msg.content.slice(client.config.prefix.length).split(/ +/gm);
    let cmd = args.shift().toLowerCase();
    let level = client.permissionCheck(msg);

    let command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));
    let global_guild_db = client.db.get(`global_${msg.channel.guild.id}`);

    let disabledPlugins = global_guild_db.disabledPlugins.map(elem => elem.toLowerCase());

    for (var i = 0; i < plugins.length; i++) {
      if (plugins[i].toLowerCase() === 'commands' || plugins[i].toLowerCase() === 'events')
        continue;

      let plugin = new (require(`${client._processDir}/plugins/${plugins[i]}/plugin`))(client);

      if (plugin.disabled || disabledPlugins.includes(plugin.name.toLowerCase())) continue;

      plugin.run(msg, args);
    };

    if (msg.content.indexOf(client.config.prefix) !== 0) return;

    if (command) {
      if (disabledPlugins.includes(command.plugin.toLowerCase())) return;

      if (level < command.permlevel)
        return msg.channel.createMessage(`You don't have enough permissions to run this command!`);

      command.run(msg, args, level);
    } else {
      return;
    };
  }
};