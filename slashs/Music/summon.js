const Discord = require(`discord.js`);
const { joinVoiceChannel, getVoiceConnection } = require (`@discordjs/voice`);

module.exports = {
	name: `summon`,
	description: `Summon/move the bot in your voice channel`,
	// botPerms: [`Administrator`],
	options: null,
	run: async (client, interaction, LANG) => {

		if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, `djrole`))) && client.settings.get(interaction.guild.id, `djrequired`) === `true`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_dj)] });
		if (client.settings.get(interaction.guild.id, `musicchannelonly`) === `true` && interaction.channel.id !== client.settings.get(interaction.guild.id, `musictextchannel`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.mco(client.settings.get(interaction.guild.id, `musictextchannel`)))] });
		if (!interaction.member.voice.channel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_vc)] });

		joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.member.voice.channel.guild.id,
			adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
		});

		if (interaction.guild.members.me.voice.channel) {
			return interaction.reply({ ephemeral: true, embeds: [new Discord.EmbedBuilder().setColor(`Random`).setTitle(LANG.title).setDescription(LANG.summoned(interaction.member.voice.channel))] });
		} else {
			getVoiceConnection(interaction.guild.id).destroy();
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.couldnt_summon(interaction.member.voice.channel))] });
		}
	},
};
