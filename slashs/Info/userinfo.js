const Discord = require(`discord.js`);
const { stripIndents } = require(`common-tags`);

module.exports = {
	name: `userinfo`,
	description: `Shows some user statistics (also available right-clicking someone)`,
	options: [
		{
			name: `user`,
			description: `User to get info about`,
			type: `USER`,
		},
	],
	run: async (client, interaction, LANG) => {
		getProfile(client, interaction, interaction.options.getMember(`user`) || interaction.member, LANG);
	},
};

module.exports.user = {
	name: `User Info`,
	type: `USER`,
	contextdescription: `Shows some user statistics`,
	run: async (client, interaction, LANG) => {
		getProfile(client, interaction, interaction.targetMember, LANG);
	},
};

async function getProfile(client, interaction, member, LANG) {
	const embed = new Discord.MessageEmbed()
		.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL() })
		.setThumbnail(member.user.displayAvatarURL())
		.setColor(member.displayHexColor)
		.addField(LANG.guild, stripIndents`
        ${LANG.nickname} ${member.displayName}
        ${LANG.joined_at} <t:${(member.joinedTimestamp / 1e3).toFixed(0)}>
        ${LANG.boosting} ${member.premiumSinceTimestamp ? `<t:${(member.premiumSinceTimestamp / 1e3).toFixed(0)}>` : LANG.no}
        ${LANG.roles} ${member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r).join(`, `) || LANG.none}`, true)
		.addField(LANG.personal, stripIndents`
        ${LANG.id} ${member.user.id}
        ${LANG.username} ${member.user.username}
        ${LANG.tag} ${member.user.tag}
        ${LANG.created_at} <t:${(member.user.createdTimestamp / 1e3).toFixed(0)}>`, true);

	if (member.presence?.activities) {
		const activitytype = LANG.activity_type;
		let activitystring = ``;
		member.presence.activities.forEach(activity => {
			activitystring += `\n> **${activitytype[activity.type]}**${activity.name == `Custom Status` ? `\n${activity.state}` : `\n${activity.name} ${activity.details ? `- *${activity.details}*` : ``}`}`;
		});
		if (activitystring.length > 0) embed.addField(LANG.activities, activitystring);
	}
	interaction.reply({ embeds: [embed] });
}