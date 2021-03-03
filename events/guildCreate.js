const { dmOwnerOnJoin, setupGuildOnJoin } = require("../functions.js");

module.exports = (client, guild) => {
    //add guild to db and set default values
    client.settings.ensure(guild.id, defaultSettings);
    setupGuildOnJoin(client, guild);
    console.log(`+ Guild: ${guild.name}`);
    //update bot activity counter
    let users = client.guilds.cache.reduce((a, g) => a + g.memberCount - 1, 0)
    client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
    //msg guild owner with setup info
    dmOwnerOnJoin(client, guild);
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