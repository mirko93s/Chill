const { dmOwnerOnJoin, setupGuildOnJoin, ensureGuildSettings, fancyNumber, guildLogWebhook } = require("../functions.js");

module.exports = (client, guild) => {
    //add guild to db and set default values
    ensureGuildSettings(client,guild.id);
    setupGuildOnJoin(client, guild);
    console.log(`+ Guild: ${guild.name}`);
    //update bot activity counter
    let users = client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0) - 1, 0);
    users = fancyNumber(users);
    client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
    //msg guild owner with setup info
    dmOwnerOnJoin(client, guild);
    //webhook-log
    guildLogWebhook(client, guild, true);
}