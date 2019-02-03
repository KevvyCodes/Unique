const Command = require('../../../base/Command');

class Balance extends Command {
  constructor(client) {
    super(client, {
      name: 'balance',
      aliases: ['bal'],
      desc: 'Checks your balance'
    })
  }

  run(msg) {
    let { currency } = this.client.db.get(`eco_${msg.channel.guild.id}`);
    let { cash, bank } = this.client.db.get(`eco_${msg.channel.guild.id + msg.author.id}`);

    let embed = new this.client.embed()
      .makeAuthor({ name: msg.author.username, iconURL: msg.author.avatarURL })
      .makeThumbnail(msg.author.avatarURL)
      .makeDescription(`You have a total of **${currency}${(cash + bank).toLocaleString()}

${currency}${cash.toLocaleString()}** From your pocket

And **${currency}${bank.toLocaleString()}** from your bank`);

    msg.channel.createEmbed(embed);
  }
};

module.exports = Balance;