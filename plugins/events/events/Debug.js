module.exports = {
  name: 'debug',
  run: (client, data) => {
    client.customLog('DEBUG', 'red', `${data.message} | Shard #${data.shard}`)
  }
};