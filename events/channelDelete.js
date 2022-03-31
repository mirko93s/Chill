module.exports = (client, channel) => {
	if (client.settings.includes(channel.guild.id, channel.id, `autovocalchannels`)) client.settings.remove(channel.guild.id, channel.id, `autovocalchannels`);
	if (client.settings.has(channel.guild.id, `usercounter`) && client.settings.get(channel.guild.id, `usercounter`) === channel.id) client.settings.delete(channel.guild.id, `usercounter`);
};