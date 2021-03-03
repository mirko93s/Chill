module.exports = (client, guild) => {
    console.log(`- Guild: ${guild.name}`)
	client.settings.delete(guild.id); //if a guild leaves, remove it from the settings db
};