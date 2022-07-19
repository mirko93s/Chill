const Discord = require(`discord.js`);

module.exports = {
	name: `ticket`,
	description: `Create and manage Tickets`,
	botPerms: [`Administrator`],
	options: [
		{
			name: `create`,
			description: `Create a ticket to get assistance from server Staff`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: null,
		},
		{
			name: `close`,
			description: `Close a ticket. Mark the ticket as solved, can be used by user or staff.`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: null,
		},
		{
			name: `delete`,
			description: `Delete this Ticket.`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: null,
		},
	],
	run: async (client, interaction, LANG) => {

		const langPrefix = LANG.channel_prefix;

		if (interaction.options.getSubcommand() === `create`) {

			const ticketalready = interaction.guild.channels.cache.find(c => c.name === `${langPrefix}-${interaction.user.username}`);
			if (ticketalready) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_opened_ticket)] });

			const category = interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `ticketcategory`)))?.id || null;
			const supportrole = interaction.guild.roles.cache.find(r => r.id === (client.settings.get(interaction.guild.id, `supportrole`)))?.id || null;

			interaction.guild.channels.create({
				name: `${langPrefix}-${interaction.user.username}`,
				type: Discord.ChannelType.GuildText,
				parent: category,
				permissionOverwrites: [
					{ id: interaction.guild.id, deny: [`ViewChannel`] },
					{ id: interaction.user.id, allow: [`ViewChannel`, `SendMessages`, `EmbedLinks`, `AttachFiles`, `ReadMessageHistory`] },
				],
			}).then(channel => {
				if (supportrole) {
					channel.permissionOverwrites.create(supportrole, {
						ViewChannel: true,
						SendMessages: true,
						ManageChannels: true,
						EmbedLinks: true,
						AttachFiles: true,
						AttachFiles: true,
						ManageMessages: true,
						ReadMessageHistory: true,
					});
				}
				const ticketEmbed = new Discord.EmbedBuilder()
					.setColor(`Random`)
					.setTitle(LANG.title)
					.setDescription(LANG.description(interaction.member));
				channel.send({ embeds: [ticketEmbed] });

				const doneEmbed = new Discord.EmbedBuilder()
					.setColor(`Random`)
					.setDescription(LANG.opened(channel));
				return interaction.reply({ ephemeral: true, embeds: [doneEmbed] });
			});
		} else if (interaction.options.getSubcommand() === `delete`) {
			if (interaction.member.roles.cache.find(supportrole => supportrole.id === (client.settings.get(interaction.guild.id, `supportrole`))) || interaction.member.permissions.has(`Administrator`)) return interaction.channel.delete();
			else return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_staff)] });
		} else if (interaction.channel.name.startsWith(langPrefix)) {
			const user = client.users.cache.find(u => u.username == `${interaction.channel.name.split(`${langPrefix}-`)[1]}`);

			interaction.channel.permissionOverwrites.create(user.id, {
				ViewChannel: true,
				ReadMessageHistory: true,
				SendMessages: false,
			});

			const ticketclosed = new Discord.EmbedBuilder()
				.setColor(`Green`)
				.setTitle(LANG.closed)
				.setDescription(`<@${user.id}>`);

			interaction.channel.setName(`❌${interaction.channel.name}`);
			interaction.reply({ embeds: [ticketclosed] });
		} else {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });
		}
	},
};
