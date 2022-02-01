module.exports = (client, oldUser, newUser) => {
	//music temp role
	let musictemprole = newUser.guild.roles.cache.find(role => role.id === (client.settings.get(newUser.guild.id, "musictemprole")));
	if (musictemprole && !newUser.member.user.bot) {
		if (newUser.guild.me.roles.highest.position < musictemprole.rawPosition) return; //check hierarchy
		if (newUser.channel !== null && newUser.channel.id === client.settings.get(newUser.guild.id, "musicvocalchannel")) {
				newUser.member.roles.add(musictemprole);
			} else newUser.member.roles.remove(musictemprole);
	}
	//autovocal remove empty cloned channels and temprole
	if (oldUser.channel !== null && client.settings.includes(oldUser.guild.id, oldUser.channel.id, "autovocalcloned") && oldUser.channel.members.size === 0) {
			client.settings.remove(oldUser.guild.id, oldUser.channel.id, "autovocalcloned");
			oldUser.channel.delete();
			let temprole = oldUser.guild.roles.cache.find(role => role.name === (`av-${oldUser.channel.id}`));
			if (temprole) temprole.delete();
	}
	//autovocal clone channel
	if (newUser.channel !== null && client.settings.includes(newUser.guild.id, newUser.channel.id, "autovocalchannels")) {
			newUser.channel.clone({name : `${newUser.channel.name} - ${newUser.member.user.username}`}).then(newchannel =>{
				client.settings.push(newUser.guild.id, newchannel.id, "autovocalcloned");
				newUser.member.voice.setChannel(newchannel);
			})
	}
	//delete queue if bot is kicked from a vc while playing
	if ((client.queue.get(oldUser.guild.id)) && (
		(newUser.channel === null && newUser.member.user.bot) || // bot kicked
		(oldUser.channel !== null && oldUser.guild.me.voice.channelId === oldUser.channelId && oldUser.channel.members.size === 1) || // users leave bot alone in a channel
		(newUser.channel !== null && newUser.member.user.bot && newUser.channel.members.size === 1)	// bot is moved to a new empty channel
		)
	) {
		const { getVoiceConnection } = require ('@discordjs/voice');
			client.queue.get(oldUser.guild.id).player.stop();
			client.queue.delete(oldUser.guild.id);
		if (getVoiceConnection(oldUser.guild.id)) return getVoiceConnection(oldUser.guild.id).destroy();
	}
};