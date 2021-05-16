const { welcomeMessage, updateServerStats} = require("../functions.js");

module.exports = (client, member) => {
	let roleonjoin = member.guild.roles.cache.find(role => role.id === client.settings.get(member.guild.id, "roleonjoin"));
	if (client.settings.get(member.guild.id, "welcomerole") === "true" && roleonjoin) member.roles.add(roleonjoin); //give default role to new members
	const welcomechannel = member.guild.channels.cache.find(welcomechannel => welcomechannel.id === (client.settings.get(member.guild.id, "welcomechannel")));
	if (client.settings.get(member.guild.id, "welcomemessage") === "true" && welcomechannel) welcomechannel.send(welcomeMessage(member, member.guild)); //send welcome message in the welcome channel
	if (client.settings.has(member.guild.id, "usercounter")) updateServerStats(client, member); //update server stats counter
};