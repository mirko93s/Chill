module.exports = (client, guild) => {
    if (guild.available === true) return console.log(`- Guild: ${guild.name}`);
    //remove guild from settings db
    if (client.settings.has(guild.id)) client.settings.delete(guild.id);
};