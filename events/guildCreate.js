module.exports = (client, guild) => {
    //add guild to db and set default values
    client.chill.ensureGuildSettings(client,guild.id);
    client.chill.setupGuildOnJoin(client, guild);
    console.log(`+ Guild: ${guild.name}`);
    //update bot activity counter
    let users = client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0) - 1, 0);
    users = client.chill.fancyNumber(users);
    client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
    //msg guild owner with setup info
    client.chill.dmOwnerOnJoin(client, guild);
    //webhook-log
    client.chillguildLogWebhook(client, guild, true);
}