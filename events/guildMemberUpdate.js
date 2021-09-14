module.exports = (client, oldUser, newUser) => {
	// give role on join after rules if guild is a community and has rules verification enabled
	if (newUser.guild.features.includes('MEMBER_VERIFICATION_GATE_ENABLED') && oldUser.pending === true && newUser.pending === false) {
		let roleonjoin = newUser.guild.roles.cache.find(role => role.id === client.settings.get(newUser.guild.id, "roleonjoin"));
		if (client.settings.get(newUser.guild.id, "welcomerole") === "true" && roleonjoin) newUser.roles.add(roleonjoin);
	}
};