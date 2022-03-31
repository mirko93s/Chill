const Discord = require(`discord.js`);

module.exports = {
	name: `blast`,
	description: `DM to all server owners`,
	dev: true,
	permissions: [
		{
			id: require(`../../config.json`).bot_owner,
			type: `USER`,
			permission: true,
		},
	],
	options: [
		{
			name: `text`,
			description: `Message to send`,
			type: `STRING`,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		let text = ``;
		interaction.options.getString(`text`).split(`\\n`).forEach(x => {
			text += x + `\n`;
		});

		const blastEmbed = new Discord.MessageEmbed()
			.setColor(`PURPLE`)
			.setTitle(`📢 **BOT UPDATE**`)
			.setDescription(text)
			.setFooter({ text: `by ${interaction.member.user.tag}`, iconURL: interaction.member.displayAvatarURL() });

		let owners = [];
		client.guilds.cache.forEach(guild => owners.push(guild.ownerId));
		owners = owners.filter(function(elem, index, self) {
			return index === self.indexOf(elem);
		});

		owners.forEach((owner, delay) => {
			setTimeout(() => {
				client.users.cache.get(owner).send({ embeds:[blastEmbed] }).catch(err => {
					return;
				});
			}, delay * 5e3);
		});

		return interaction.reply({ ephemeral:true, content:`**Blasted all owners!**` });
	},
};