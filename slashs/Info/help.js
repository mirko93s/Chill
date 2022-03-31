const Discord = require(`discord.js`);

module.exports = {
	name: `help`,
	description: `Show command list or check a specific command`,
	options: [
		{
			name: `command`,
			description: `Which command to get info about`,
			type: `STRING`,
		},
	],
	run: async (client, interaction, LANG) => {

		if (interaction.options.getString(`command`)) {
			return getCMD(client, interaction, interaction.options.getString(`command`));
		} else {
			return getAll(client, interaction, LANG);
		}
	},
};

function getAll(client, interaction, LANG) {
	const helpembed = new Discord.MessageEmbed()
		.setTitle(LANG.title)
		.setDescription(LANG.description)
		.setColor(0x00AE86)
		.setThumbnail(client.user.displayAvatarURL())
	/* Admin */.addField(LANG.admin, `\`announce\` \`channel\` \`drop\` \`emojifind\` \`giveaway\` \`poll\` \`reactionrole\` \`usercounter\``, true)
	/* Auto-Vocal*/.addField(LANG.av, `\`autovocal\` \`autovocal_create\``, true)
	/* Bot */.addField(LANG.bot, `\`bot\` \`bug\``, true)
	/* Commands */.addField(LANG.commands, `\`command\` \`customcommand\` \`customcommandlist\``, true)
	/* Fun */.addField(LANG.fun, `\`8ball\` \`achievement\` \`activities\` \`ascii\` \`coinflip\` \`ship\``, true)
	/* Games */.addField(LANG.games, `\`akinator\` \`connect4\` \`flood\` \`hangman\` \`match\` \`rockpaperscissors\` \`slotmachine\` \`tictactoe\``, true)
	/* Info */.addField(LANG.info, `\`avatar\` \`github\` \`help\` \`serveremojis\` \`serverinfo\` \`userinfo\``, true)
	/* Moderation */.addField(LANG.moderation, `\`ban\` \`clear\` \`kick\` \`report\` \`say\` \`slowmode\` \`ticket\` \`timeout\``, true)
	/* Other */.addField(LANG.other, `\`calc\` \`mcstat\` \`nick\` \`percentage\` \`ping\` \`qr\` \`remindme\` \`today\` \`translate\` \`urban\` \`weather\``, true)
	/* Owner */.addField(LANG.owner, `\`blast\` \`botactivity\` \`cmd\` \`cmdstats\` \`guilds\``, true)
	/* Roles */.addField(LANG.roles, `\`roleinfo\` \`rolelist\` \`userrole\``, true)
	/* Settings */.addField(LANG.settings, `\`resetconfig\` \`setconfig\` \`setup\` \`showconfig\``, true)
	/* Xp */.addField(LANG.xp, `\`leaderboard\` \`level\` \`rewards\` \`xp\``, true)
	/* blank-field-to-keep-column-width-reserved-for-future-categories */.addField(`\u200b`, `\u200b`, true)
	/* blank-field-to-keep-column-width-reserved-for-future-categories */.addField(`\u200b`, `\u200b`, true);

	return client.chill.buttonLinks(interaction, helpembed);
}

function getCMD(client, interaction, input) {
	const embed = new Discord.MessageEmbed();

	const cmd = client.slashs.get(input.toLowerCase());

	if (!cmd || cmd.debug) return interaction.reply({ ephemeral: true, embeds: [embed.setColor(`RED`).setDescription(`⛔ No information found for command **${input.length > 128 ? input.toLowerCase().substring(0, 128) + `...` : input.toLowerCase()}**`)] });

	embed.setDescription (LANG.cmd_description(cmd));
	if (cmd.usage) embed.description += LANG.cmd_usage(cmd);
	if (cmd.userPerms) embed.description += LANG.cmd_userPerms(cmd);
	if (cmd.botPerms) embed.description += LANG.cmd_botPerms(cmd);

	return interaction.reply({ embeds: [embed.setColor(`GREEN`).setTitle(`**${cmd.name}**`)] });
}