const Discord = require(`discord.js`);
const fetch = require(`node-fetch`);

module.exports = {
	name: `github`,
	description: `Get info about a Github repository`,
	options: [
		{
			name: `username`,
			description: `Username`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 256,
			required: true,
		},
		{
			name: `repo`,
			description: `Repository name`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 256,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const username = interaction.options.getString(`username`);
		const repo = interaction.options.getString(`repo`);

		const res = await fetch(`https://api.github.com/repos/${username}/${repo}`);
		if (res.status !== 200) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_result(username, repo))] });
		const json = await res.json();

		const embed = new Discord.EmbedBuilder()
			.setAuthor({ name: json.owner.login, url: `https://github.com/${username}` })
			.setTitle(`/${repo}`)
			.setURL(`https://github.com/${json.full_name}`)
			.setDescription(json.description)
			.addFields([
				{
					name: LANG.stars,
					value: `[${json.stargazers_count}](https://github.com/${json.full_name}/stargazers)`,
					inline: true,
				},
				{
					name: LANG.forks,
					value: `[${json.forks_count}](https://github.com/${json.full_name}/network/members)`,
					inline: true,
				},
				{
					name: LANG.watchers,
					value: `[${json.subscribers_count}](https://github.com/${json.full_name}/watchers)`,
					inline: true,
				},
				{
					name: LANG.language,
					value: json.language || json?.parent.language,
					inline: true,
				},
				{
					name: LANG.created_at,
					value: `<t:${Date.parse(json.created_at) / 1e3}:R>`,
					inline: true,
				},
				{
					name: LANG.last_update,
					value: `<t:${Date.parse(json.updated_at) / 1e3}:R>`,
					inline: true,
				},
			])
			.setThumbnail(json.owner.avatar_url)
			.setColor(`Random`);
		if (json.topics.length > 0) {
			embed.addFields([
				{
					name: LANG.tags,
					value: `\`${json.topics.join(`\` \``)}\``,
					inline: true,
				},
			]);
		}
		if (json.parent) {
			embed.addFields([
				{
					name: LANG.forked,
					value: `[${json.parent.full_name}](https://github.com/${json.parent.full_name})`,
					inline: true,
				},
			]);
		}

		interaction.reply({ embeds: [embed] });
	},
};