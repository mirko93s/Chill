const { updateServerStats, welcomeMessage } = require("../functions.js");

module.exports = (client, member) => {
    if(client.settings.has(member.guild.id, `xp.${member.id}`)) client.settings.delete(member.guild.id, `xp.${member.id}`);
    if (client.settings.has(member.guild.id, "usercounter")) updateServerStats(client, member); //update server stats counter
    const welcomechannel = member.guild.channels.cache.find(welcomechannel => welcomechannel.id === (client.settings.get(member.guild.id, "welcomechannel")));
	if (client.settings.get(member.guild.id, "welcomemessage") === "true" && welcomechannel) welcomechannel.send({embeds:[welcomeMessage(member, member.guild, false)]});
};