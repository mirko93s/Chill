module.exports = (client, oldUser, newUser) => {
    client.settings.ensure(newUser.guild.id, defaultSettings);
    //music temp role
	let musictemprole = newUser.guild.roles.cache.find(role => role.id === (client.settings.get(newUser.guild.id, "musictemprole")));
	if (musictemprole) {
		if (newUser.channel !== null && newUser.channel.id === client.settings.get(newUser.guild.id, "musicvocalchannel")) {
				newUser.member.roles.add(musictemprole);
			} else newUser.member.roles.remove(musictemprole);
	}
    //autovocal remove empty channels and temprole
	if (oldUser.channel !== null && client.settings.includes(oldUser.guild.id, oldUser.channel.id, "autovocalcloned") && oldUser.channel.members.size === 0) {
			client.settings.remove(oldUser.guild.id, oldUser.channel.id, "autovocalcloned");
			oldUser.channel.delete();
			let temprole = oldUser.guild.roles.cache.find(role => role.name === (`av-${oldUser.channel.id}`));
			if (temprole) temprole.delete();
	}
    //autovocal clone channel
	if (newUser.channel !== null && client.settings.includes(newUser.guild.id, newUser.channel.id, "autovocalchannels")) {
			newUser.channel.clone().then(newchannel =>{
				client.settings.push(newUser.guild.id, newchannel.id, "autovocalcloned");
				newchannel.setName(`${newchannel.name} - ${newUser.member.user.username}`);
				newUser.member.voice.setChannel(newchannel);
			})
	}
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