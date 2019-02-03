const Plugin = require('../../base/Plugin');
const { readdirSync } = require('fs');

class plugin_Events extends Plugin {
  constructor(client) {
    super(client, {
      name: 'events',
      desc: 'This plugin is also responsible for the commands, if this is disabled the bot won\'t listen for events, e.g sending messages'
    })
  }

  run() {
    let events = readdirSync(`${__dirname}/events`);

    for (var i = 0; i < events.length; i++) {
      if (events[i].split('.')[1] !== 'js') continue;

      let event = require(`./events/${events[i]}`);
      let event_data = {
        name: event.name,
        desc: event.desc || 'An Event',
        disabled: event.disabled || false,
        run: event.run
      }

      if (event_data.disabled || this.client.disabledEvents.includes(event_data.name)) {
        this.client.customLog('EVENTS PLUGIN', 'red', `Event: ${event_data.name} was disabled! Will not listen to it`);
        continue;
      };

      this.client.on(event_data.name, event_data.run.bind(null, this.client));
    };
  }
};

module.exports = plugin_Events;