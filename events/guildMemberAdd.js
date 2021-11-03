module.exports = (client, member) => {
	// update user counter channel
	if (client.settings.has(member.guild.id, "usercounter")) client.chill.updateServerStats(client, member); //update server stats counter
	// welcome message
	const welcomechannel = member.guild.channels.cache.find(welcomechannel => welcomechannel.id === (client.settings.get(member.guild.id, "welcomechannel")));
	if (client.settings.get(member.guild.id, "welcomemessage") === "true" && welcomechannel) welcomechannel.send({embeds:[client.chill.welcomeMessage(member, member.guild)]});
	// role on join
	let roleonjoin = member.guild.roles.cache.find(role => role.id === client.settings.get(member.guild.id, "roleonjoin"));
	if (client.settings.get(member.guild.id, "welcomerole") === "true" && roleonjoin && !member.guild.features.includes('MEMBER_VERIFICATION_GATE_ENABLED')) member.roles.add(roleonjoin);
};