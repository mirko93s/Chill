module.exports = (client, oldUser, newUser) => {
	// give role on join after rules if guild is a community and has rules verification enabled
	if (newUser.guild.features.includes(`MEMBER_VERIFICATION_GATE_ENABLED`) && oldUser.pending === true && newUser.pending === false) {
		const roleonjoin = newUser.guild.roles.cache.find(r => r.id === client.settings.get(newUser.guild.id, `roleonjoin`));
		if (client.settings.get(newUser.guild.id, `welcomerole`) && roleonjoin) {
			newUser.roles.add(roleonjoin).catch(err => {
				return;
			});
		}
	}
};