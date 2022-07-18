const Discord = require(`discord.js`);
const { stripIndent } = require(`common-tags`);

module.exports = {
	name: `serverinfo`,
	description: `Shows some server statistics`,
	options: null,
	run: async (client, interaction, LANG) => {

		const filterLevels = LANG.filter_obj;
		const verificationLevels = LANG.verification_obj;
		const tierLevels = LANG.tier_obj;

		const channels = stripIndent`
		${LANG.text} ${interaction.guild.channels.cache.filter(chan => chan.type === `GUILD_TEXT`).size}
		${LANG.voice} ${interaction.guild.channels.cache.filter(chan => chan.type === `GUILD_VOICE`).size}
        `;

		const boost = stripIndent`
		${LANG.count} ${interaction.guild.premiumSubscriptionCount || 0}
		${LANG.tier} ${tierLevels[interaction.guild.premiumTier]}
        `;

		const members = stripIndent`
		${LANG.online} ${await interaction.guild.members.fetch().then(f => f.filter(m => m.presence !== `offline` && m.presence !== null).size)}
		${LANG.total} ${interaction.guild.memberCount}
        `;

		const other = stripIndent`
		${LANG.owner} ${await interaction.guild.fetchOwner().then(o => o.user.tag)}
		${LANG.created_at} ${interaction.guild.createdAt.toLocaleString()}
		${LANG.verification} ${verificationLevels[interaction.guild.verificationLevel]}
		${LANG.filter} ${filterLevels[interaction.guild.explicitContentFilter]}
		${LANG.roles} ${interaction.guild.roles.cache.size}
        `;

		const embed = new Discord.EmbedBuilder()
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
			.setColor(`Random`)
			.setThumbnail(interaction.guild.iconURL())
			.addFields([
				{
					name: LANG.members,
					value: `\`\`\`asciidoc\n${members}\`\`\``,
					inline: true,
				},
				{
					name: LANG.channels,
					value: `\`\`\`asciidoc\n${channels}\`\`\``,
					inline: true,
				},
				{
					name: LANG.boost,
					value: `\`\`\`asciidoc\n${boost}\`\`\``,
					inline: false,
				},
				{
					name: LANG.other,
					value: `\`\`\`asciidoc\n${other}\`\`\``,
					inline: false,
				},
			]);

		interaction.reply({ embeds: [embed] });
	},
};
