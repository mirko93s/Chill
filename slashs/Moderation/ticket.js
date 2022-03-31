const Discord = require(`discord.js`);

module.exports = {
	name: `ticket`,
	description: `Create and manage Tickets`,
	botPerms: [`ADMINISTRATOR`],
	options: [
		{
			name: `create`,
			description: `Create a ticket to get assistance from server Staff`,
			type: `SUB_COMMAND`,
			options: null,
		},
		{
			name: `close`,
			description: `Close a ticket. Mark the ticket as solved, can be used by user or staff.`,
			type: `SUB_COMMAND`,
			options: null,
		},
		{
			name: `delete`,
			description: `Delete this Ticket.`,
			type: `SUB_COMMAND`,
			options: null,
		},
	],
	run: async (client, interaction, LANG) => {

		const noticketchannelEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ You are not in a ticket channel!`);
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setDescription(`⛔ You need the be part of the Staff or an Administrator to use this command!`);
		const alreadyEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ You already have an opened ticket!`);

		if (interaction.options.getSubcommand() === `create`) {

			const langPrefix = LANG.channel_prefix;

			const ticketalready = interaction.guild.channels.cache.find(c => c.name === `${langPrefix}-${interaction.user.username}`);
			if (ticketalready) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_opened_ticket)] });

			const category = interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `ticketcategory`)))?.id || null;
			const supportrole = interaction.guild.roles.cache.find(r => r.id === (client.settings.get(interaction.guild.id, `supportrole`)))?.id || null;

			interaction.guild.channels.create(`${langPrefix}-${interaction.user.username}`, {
				type: `GUILD_TEXT`,
				parent: category,
				permissionOverwrites: [
					{ id: interaction.guild.id, deny: [`VIEW_CHANNEL`] },
					{ id: interaction.user.id, allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`, `EMBED_LINKS`, `ATTACH_FILES`, `READ_MESSAGE_HISTORY`] },
				],
			}).then(channel => {
				if (supportrole) {
					channel.permissionOverwrites.create(supportrole, {
						VIEW_CHANNEL: true,
						SEND_MESSAGES: true,
						MANAGE_CHANNELS: true,
						EMBED_LINKS: true,
						ATTACH_FILES: true,
						ATTACH_FILES: true,
						MANAGE_MESSAGES: true,
						READ_MESSAGE_HISTORY: true,
					});
				}
				const ticketEmbed = new Discord.MessageEmbed()
					.setColor(`RANDOM`)
					.setTitle(LANG.title)
					.setDescription(LANG.description(interaction.member));
				channel.send({ embeds: [ticketEmbed] });

				const doneEmbed = new Discord.MessageEmbed()
					.setColor(`RANDOM`)
					.setDescription(LANG.opened(channel));
				return interaction.reply({ ephemeral: true, embeds: [doneEmbed] });
			});
		} else if (interaction.options.getSubcommand() === `delete`) {
			if (interaction.member.roles.cache.find(supportrole => supportrole.id === (client.settings.get(interaction.guild.id, `supportrole`))) || interaction.member.permissions.has(`ADMINISTRATOR`)) return interaction.channel.delete();
			else return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_staff)] });
		} else if (interaction.channel.name.startsWith(langPrefix)) {
			const user = client.users.cache.find(u => u.username == `${interaction.channel.name.split(`${langPrefix}-`)[1]}`);

			interaction.channel.permissionOverwrites.create(user.id, {
				VIEW_CHANNEL: true,
				READ_MESSAGE_HISTORY: true,
				SEND_MESSAGES: false,
			});

			const ticketclosed = new Discord.MessageEmbed()
				.setColor(`GREEN`)
				.setTitle(LANG.closed)
				.setDescription(`<@${user.id}>`);

			interaction.channel.setName(`❌${interaction.channel.name}`);
			interaction.reply({ embeds: [ticketclosed] });
		} else {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });
		}
	},
};
