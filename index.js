const { Client, Store, EmbedBuilder } = require('jcord');
const Enmap = require('enmap');

let { readdirSync } = require('fs');

class Embed extends EmbedBuilder {
  constructor(data) {
    super(data);

    this.color = 0x36393F;
    this.timestamp = new Date();
  }
};

class Unique extends Client {
  constructor(options = {}) {
    super(options);

    // System
    this.embed = Embed;

    // Properties & options
    this.commands = new Store();
    this._processDir = __dirname;
    this.config = require('./config');
    this.db = new Enmap({ name: 'unique_db' });
    this.disabledEvents = options.disabledEvents || [];
    this.disabledPlugins = Array.isArray(options.disabledPlugins) ? options.disabledPlugins.map(item => item.toLowerCase()) : [];
  }

  permissionCheck(msg) {
    let perm = 0;

    if (msg.member.permissions.has('manageMessages')) perm = 1;
    if (msg.member.permissions.has('kickMembers')) perm = 2;
    if (msg.member.permissions.has('banMembers')) perm = 3;
    if (msg.member.permissions.has('administrator')) perm = 4;
    if (msg.channel.guild.owner ? msg.channel.guild.owner.id === msg.author.id : msg.channel.guild.ownerID === msg.author.id) perm = 5;
    if (this.config.owners.includes(msg.author.id)) perm = 6;

    return perm;
  }
};

const client = new Unique({ logger: true, disabledPlugins: [], shardCount: 'auto' });

// Let us load the plugins here
let plugins = readdirSync('./plugins');

for (var i = 0; i < plugins.length; i++) {
  if (!(readdirSync(`./plugins/${plugins[i]}`).includes('plugin.js')))
    client.emit('error', new Error(`Invalid Plugin: ${plugins[i]} No plugin.js file`));

  let plugin = new (require(`./plugins/${plugins[i]}/plugin`))(client);

  if (plugin.disabled || client.disabledPlugins.includes(plugins[i].toLowerCase())) {
    client.customLog(`DISABLED PLUGIN`, 'red', `Plugin: ${plugins[i]} was disabled! Will not run the plugin.`);
    continue;
  }

  if (plugins[i].toLowerCase() !== 'commands' && plugins[i].toLowerCase() !== 'events') continue;

  plugin.run();
};

client.initiate(client.config.token);