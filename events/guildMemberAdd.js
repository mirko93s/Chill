const { welcomeMessage } = require("../functions.js");

module.exports = (client, member) => {
    client.settings.ensure(member.guild.id, defaultSettings);
	let roleonjoin = member.guild.roles.cache.find(role => role.id === client.settings.get(member.guild.id, "roleonjoin"));
	if (!roleonjoin) return;
	member.roles.add(roleonjoin); //give default role to new members
	const welcomechannel = member.guild.channels.cache.find(welcomechannel => welcomechannel.id === (client.settings.get(member.guild.id, "welcomechannel")));
	if (welcomechannel) return welcomechannel.send(welcomeMessage(member, member.guild));
		else return; //send welcome embed in welcome channel
};

const defaultSettings = {
	prefix: ".",
	welcomechannel: "👋welcome",
	bcchannel: "🔴broadcast",
	puchannel: "🔨punishments",
	reportchannel: "🚨reports",
	gachannel: "🎉giveaway",
	pollchannel: "💡poll",
	musicvocalchannel: "🔊music",
	musictextchannel: "🎵song-request",
	musictemprole: "Listening",
	ticketcategory: "tickets",
	mutedrole: "Muted",
	djrole: "DJ",
	supportrole: "Support",
	roleonjoin: "Member",
	musicchannelonly: "false",
	xpcooldown: 5,
	autodeletecmds: "true",
	autovocalchannels: [],
	autovocalcloned: [],
	disabledcommands: []
}