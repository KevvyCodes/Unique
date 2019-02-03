module.exports = {
  name: 'SHARD_READY',
  run: (client, shard) => {
    client.customLog('SHARD READY', 'magenta', `Shard #${shard.id} is now ready!`);
  }
};