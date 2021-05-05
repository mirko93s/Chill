module.exports = (client, guild) => {
    console.log(`- Guild: ${guild.name}`)
    //remove guild from settings db
    if (client.settings.has(guild.id)) client.settings.delete(guild.id);
};