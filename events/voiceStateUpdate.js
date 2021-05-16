module.exports = (client, oldUser, newUser) => {
	//music temp role
	let musictemprole = newUser.guild.roles.cache.find(role => role.id === (client.settings.get(newUser.guild.id, "musictemprole")));
	if (musictemprole) {
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
			newUser.channel.clone().then(newchannel =>{
				client.settings.push(newUser.guild.id, newchannel.id, "autovocalcloned");
				newchannel.setName(`${newchannel.name} - ${newUser.member.user.username}`);
				newUser.member.voice.setChannel(newchannel);
			})
	}
	//delete queue if bot is kicked from a vc while playing
	if (newUser.member.user.bot && newUser.channel === null) return client.queue.delete(newUser.guild.id);
};