/**
 *
 * @param {Client} client
 * @param {Object} member
 */
module.exports = function(client, member) {
	if (client.serverstatscooldown.has(member.guild.id)) return;
	member.guild.channels.fetch(client.settings.get(member.guild.id, `usercounter`)).then(usercounterchannel => {
		if (usercounterchannel) { // check if channel still exists
			let memberCount = member.guild.members.cache.filter(m => !m.user.bot).size;
			memberCount = client.chill.fancyNumber(memberCount);
			usercounterchannel.setName(`👥・${memberCount} users`); // take lang from membercount command
			client.serverstatscooldown.add(member.guild.id); // cooldown
			setTimeout(() => {
				client.serverstatscooldown.delete(member.guild.id);
			}, 30 * 60 * 1000);
		} else { // if channel doesn't exist delete usercounter from db disabling the feature
			client.settings.delete(member.guild.id, `usercounter`);
		}
	});
};