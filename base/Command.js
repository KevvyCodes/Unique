class Command {
  constructor(client, {
    name = null,
    aliases = [],
    desc = 'A Command',
    usage = '',
    permlevel = 0,
    plugin = ''
}) {
    this.client = client;

    this.name = name;
    this.aliases = aliases;
    this.desc = desc;
    this.usage = usage;
    this.permlevel = permlevel;
    this.plugin = plugin;
  }
};

module.exports = Command;