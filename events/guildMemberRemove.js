module.exports = (client, member) => {
	if (client.settings.has(member.guild.id, `xp.${member.id}`)) client.settings.delete(member.guild.id, `xp.${member.id}`);
	if (client.settings.has(member.guild.id, `usercounter`)) client.chill.updateServerStats(client, member); // update server stats counter
	const welcomechannel = member.guild.channels.cache.find(c => c.id === (client.settings.get(member.guild.id, `welcomechannel`)));
	if (client.settings.get(member.guild.id, `welcomemessage`) && welcomechannel) welcomechannel.send({ embeds: [client.chill.welcomeMessage(client, member, member.guild, false)] });
};