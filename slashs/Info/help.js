const Discord = require(`discord.js`);

module.exports = {
	name: `help`,
	description: `Show command list or check a specific command`,
	options: [
		{
			name: `command`,
			description: `Which command to get info about`,
			maxLength: 256,
			type: Discord.ApplicationCommandOptionType.String,
		},
	],
	run: async (client, interaction, LANG) => {

		if (interaction.options.getString(`command`)) {
			return getCMD(client, interaction, interaction.options.getString(`command`), LANG);
		} else {
			return getAll(client, interaction, LANG);
		}
	},
};

function getAll(client, interaction, LANG) {
	const helpembed = new Discord.EmbedBuilder()
		.setTitle(LANG.title)
		.setDescription(LANG.description)
		.setColor(0x00AE86)
		.setThumbnail(client.user.displayAvatarURL())
		.addFields([
			{
				name: LANG.admin,
				value: `\`announce\` \`channel\` \`drop\` \`emojifind\` \`giveaway\` \`poll\` \`reactionroles\` \`usercounter\``,
				inline: true,
			},
			{
				name: LANG.av,
				value: `\`autovocal\` \`autovocal_create\``,
				inline: true,
			},
			{
				name: LANG.bot,
				value: `\`bot\` \`bug\``,
				inline: true,
			},
			{
				name: LANG.commands,
				value: `\`command\` \`customcommand\` \`customcommand_list\``,
				inline: true,
			},
			{
				name: LANG.fun,
				value: `\`8ball\` \`achievement\` \`activities\` \`ascii\` \`coinflip\` \`ship\``,
				inline: true,
			},
			{
				name: LANG.games,
				value: `\`akinator\` \`connect4\` \`flood\` \`hangman\` \`match\` \`rockpaperscissors\` \`slotmachine\` \`tictactoe\``,
				inline: true,
			},
			{
				name: LANG.info,
				value: `\`avatar\` \`github\` \`help\` \`serveremojis\` \`serverinfo\` \`userinfo\``,
				inline: true,
			},
			{
				name: LANG.moderation,
				value: `\`ban\` \`clear\` \`kick\` \`report\` \`say\` \`slowmode\` \`ticket\` \`timeout\``,
				inline: true,
			},
			{
				name: LANG.music,
				value: `\`nowplaying\` \`pause\` \`play\` \`queue\` \`resume\` \`skip\` \`stop\` \`summon\` \`volume\``,
				inline: true,
			},
			{
				name: LANG.other,
				value: `\`calc\` \`mcstat\` \`nickname\` \`percentage\` \`ping\` \`qr\` \`remindme\` \`today\` \`translate\` \`urban\` \`weather\``,
				inline: true,
			},
			{
				name: LANG.owner,
				value: `\`blast\` \`botactivity\` \`cmd\` \`cmdstats\` \`guilds\``,
				inline: true,
			},
			{
				name: LANG.roles,
				value: `\`roleinfo\` \`rolelist\` \`userrole\``,
				inline: true,
			},
			{
				name: LANG.settings,
				value: `\`resetconfig\` \`setconfig\` \`setup\` \`showconfig\``,
				inline: true,
			},
			{
				name: LANG.xp,
				value: `\`leaderboard\` \`level\` \`rewards\` \`xp\``,
				inline: true,
			},
			{
				name: `\u200b`,
				value: `\u200b`,
				inline: true,
			},
		]);

	return client.chill.buttonLinks(interaction, helpembed);
}

function getCMD(client, interaction, input, LANG) {
	const embed = new Discord.EmbedBuilder();

	const cmd = client.slashs.get(input.toLowerCase());

	if (!cmd || cmd.debug) return interaction.reply({ ephemeral: true, embeds: [embed.setColor(`Red`).setDescription(`⛔ No information found for command **${input.length > 128 ? input.toLowerCase().substring(0, 128) + `...` : input.toLowerCase()}**`)] });

	embed.setDescription (LANG.cmd_description(cmd.description));
	if (cmd.usage) embed.description += LANG.cmd_usage(cmd.usage);
	if (cmd.userPerms) embed.description += LANG.cmd_userPerms(cmd.userPerms.join(`\`, \``));
	if (cmd.botPerms) embed.description += LANG.cmd_botPerms(cmd.botPerms.join(`\`, \``));

	return interaction.reply({ embeds: [embed.setColor(`Green`).setTitle(`**${cmd.name}**`)] });
}