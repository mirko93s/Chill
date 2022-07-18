const Discord = require(`discord.js`);
const ms = require(`ms`);
const CryptoJS = require(`crypto-js`);

module.exports = {
	name: `remindme`,
	description: `Set a reminder for yourself, only you will be able to read it. (Open DMs are required to receive it)`,
	options: [
		{
			name: `time`,
			description: `Time (automatically caps at approximately 25 days)`,
			type: Discord.ApplicationCommandOptionType.Integer,
			required: true,
			minValue: 1,
			maxValue: 60,
		},
		{
			name: `unit`,
			description: `Time unit`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{
					name: `seconds`,
					value: `s`,
				},
				{
					name: `minutes`,
					value: `m`,
				},
				{
					name: `hours`,
					value: `h`,
				},
				{
					name: `days`,
					value: `d`,
				},
			],
		},
		{
			name: `text`,
			description: `What do I have to remind you?`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
		},
	],

	run: async (client, interaction, LANG) => {

		let time = ms(interaction.options.getInteger(`time`) + interaction.options.getString(`unit`));
		time > 2147483647 ? time = 2147483647 : time = time;

		const encrypted = CryptoJS.AES.encrypt(interaction.options.getString(`text`).substring(0, 3072), require(`../../config.json`).crypto_key).toString();

		const id_time = `${interaction.member.id}-${Date.now() + time}`;

		function reminder() {
			const reminderEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setTitle(LANG.title)
				.setDescription(CryptoJS.AES.decrypt(encrypted, require(`../../config.json`).crypto_key).toString(CryptoJS.enc.Utf8));
			client.intervals.delete(`reminders`, id_time);
			interaction.member.send({ embeds: [reminderEmbed] }).catch(() => {
				return;
			});
		}
		client.intervals.set(`reminders`, encrypted, id_time);
		interaction.reply({ ephemeral: true, content: LANG.set(ms(time)) });
		setTimeout(reminder, time);
	},
};