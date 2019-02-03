module.exports = {
  token: 'TOKEN',
  prefix: 'u:',
  owners: ['YOUR ID'],
  eco_guild_db: {
    currency: '$',
    store: [],
    modlog: null,
    cases: 0
  },
  mod_guild_db: {
    modlog: null,
    cases: 0
  },
  eco_user_db: {
    achievements: [],
    cash: 0,
    bank: 0,
    hasLoaned: false,
    loan: { amount: 0, overdue: false, expiration: null },
    claimedFreebies: false,
    inventory: []
  },
  mod_user_db: {
    bans: 0,
    kick: 0,
    warns: 0,
    mutes: 0,
    unbans: 0
  },

  // This is part of the database that all of plugins need
  global_guild_db: {
    disabledPlugins: ['economy']
  }
};