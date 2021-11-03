module.exports = (client, guild) => {
    if (guild.available === true) {
        console.log(`- Guild: ${guild.name}`);
        client.chill.guildLogWebhook(client, guild, false);
    }
    //remove guild from settings db
    if (client.settings.has(guild.id)) client.settings.delete(guild.id);
};