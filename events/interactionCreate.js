const { ChannelType } = require (`discord.js`);

module.exports = async (client, interaction) => {
	const LANG = client.lang(interaction.guild?.preferredLocale || `en-US`, `events`, `interactionCreate`);
	const devID = require(`../config.json`).bot_owner;
	if (interaction.type !== 2) return;
	if (interaction.channel.type === ChannelType.DM) return interaction.reply({ embeds: [client.chill.error(LANG.no_dm)] });
	// get command
	const command = client.slashs.get(interaction.commandName);
	if (!command) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.get_cmd_error)] });
	// check if command is disabled by dev
	if (client.cmdstats.includes(`disabled`, interaction.commandName)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.dev_disabled(command.name))] });
	// check if dev only
	if (command.dev && interaction.member.user.id !== devID) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.dev_only)] });
	// check user perms
	if (command.userPerms) {
		if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.id).permissions.has(command.userPerms || [])) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(command.userPerms.length > 1 ? LANG.user_perms_p(command.userPerms.join(`\` \``)) : LANG.user_perms_s(command.userPerms.join(`\` \``)))] });
	}
	// check bot perms
	if (command.botPerms) {
		if (!interaction.guild.members.me.permissions.has(command.botPerms || [])) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(command.botPerms.length > 1 ? LANG.bot_perms_p(command.botPerms.filter(perm => !interaction.guild.members.me.permissions.toArray().includes(perm)).join(`\` \``)) : LANG.bot_perms_s(command.botPerms.filter(perm => !interaction.guild.members.me.permissions.toArray().includes(perm)).join(`\` \``)))] });
	}
	// subcommand check
	const args = [];
	for (const option of interaction.options.data) {
		if (option.type === `SUB_COMMAND`) {
			if (option.name) args.push(option.name);
			option.options?.forEach(x => {
				if (x.value) args.push(x.value);
			});
		} else if (option.value) {
			args.push(option.value);
		}
	}
	// run slash command
	try {
		if (client.settings.includes(interaction.guild.id, command.name, `disabledcommands`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.guild_disabled(command.name))] }); // check if command is disabled on the guild
		await command.run(client, interaction, client.lang(interaction.guild.preferredLocale, `commands`, interaction.commandName));
		client.cmdstats.inc(`usage`, command.name);
	} catch (err) {
		console.error(err);
		if (interaction.replied || interaction.deferred) interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
		else interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
	}
};