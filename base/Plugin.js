class Plugin {
  constructor(client, {
    commands_dir = null,
    name = null,
    disabled = false,
    desc = 'A plugin.'
  }) {
    this.client = client;

    this.commands_dir = commands_dir;
    this.name = name;
    this.disabled = disabled;
    this.desc = desc;
  }
};

module.exports = Plugin