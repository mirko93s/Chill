/**
 * @param {Client} client
 * @param {Object} guild @requires
 * @description creates deafult channels, roles, etc on guild join
 */

const { ChannelType } = require(`discord.js`);

module.exports = async function(client, guild) {

	if (!guild.members.me.permissions.toArray().includes(`Administrator`)) return;
	if (!guild.members.me.permissions.toArray().includes(`ManageRoles`) && !guild.members.me.permissions.toArray().includes(`ManageChannels`)) return;
	// roles
	await guild.roles.create({ name: `Listening`, permissions: [], color: `CCCC00` })
		.then(role => {
			client.settings.set(guild.id, role.id, `musictemprole`);
		});
	guild.roles.create({ name: `DJ`, permissions: [`Connect`], color: `D00091` })
		.then(role => {
			client.settings.set(guild.id, role.id, `djrole`);
		});
	guild.roles.create({ name: `Staff`, permissions: [], color: `FC72F3` })
		.then(role => {
			client.settings.set(guild.id, role.id, `supportrole`);
		});
	guild.roles.create({ name: `Member`, permissions: [`ViewChannel`], color: `33FFFF` })
		.then(role => {
			client.settings.set(guild.id, role.id, `roleonjoin`);
		});
	// channels
	guild.channels.create(`🎫tickets`, { type: ChannelType.GuildCategory })
		.then(channel => {
			client.settings.set(guild.id, channel.id, `ticketcategory`);
		});
	guild.channels.create(`👋welcome`, { type: ChannelType.GuildText,
		permissionOverwrites: [{ id: guild.roles.everyone.id,
			deny: [`SendMessages`, `SendTTSMessages`, `EmbedLinks`, `AttachFiles`] }] })
		.then(channel => {
			client.settings.set(guild.id, channel.id, `welcomechannel`);
		});
	guild.channels.create(`📢announcements`, { type: ChannelType.GuildText,
		permissionOverwrites: [{ id: guild.roles.everyone.id,
			deny: [`SendMessages`, `SendTTSMessages`, `EmbedLinks`, `AttachFiles`] }] })
		.then(channel => {
			client.settings.set(guild.id, channel.id, `bcchannel`);
		});
	guild.channels.create(`🔨punishments`, { type: ChannelType.GuildText,
		permissionOverwrites: [{ id: guild.roles.everyone.id,
			deny: [`SendMessages`, `SendTTSMessages`, `EmbedLinks`, `AttachFiles`] }] })
		.then(channel => {
			client.settings.set(guild.id, channel.id, `puchannel`);
		});
	guild.channels.create(`🚨reports`, { type: ChannelType.GuildText,
		permissionOverwrites: [{ id: guild.roles.everyone.id,
			deny: [`ViewChannel`] }] })
		.then(channel => {
			client.settings.set(guild.id, channel.id, `reportchannel`);
		});
	guild.channels.create(`🎉giveaway`, { type: ChannelType.GuildText,
		permissionOverwrites: [{ id: guild.roles.everyone.id,
			deny: [`SendMessages`, `SendTTSMessages`, `EmbedLinks`, `AttachFiles`] }] })
		.then(channel => {
			client.settings.set(guild.id, channel.id, `gachannel`);
		});
	guild.channels.create(`💡poll`, { type: ChannelType.GuildText,
		permissionOverwrites: [{ id: guild.roles.everyone.id,
			deny: [`SendMessages`, `SendTTSMessages`, `EmbedLinks`, `AttachFiles`] }] })
		.then(channel => {
			client.settings.set(guild.id, channel.id, `pollchannel`);
		});
	guild.channels.create(`🔊music`, { type: ChannelType.GuildVoice,
		permissionOverwrites: [{ id: guild.roles.everyone.id,
			deny: [`Speak`] }] })
		.then(channel => {
			client.settings.set(guild.id, channel.id, `musicvocalchannel`);
		});
	guild.channels.create(`🎵song-request`, { type: ChannelType.GuildText,
		permissionOverwrites: [
			{ id: guild.id,
				deny: [`ViewChannel`] },
			{ id: client.settings.get(guild.id, `musictemprole`),
				allow: [`ViewChannel`, `SendMessages`] }] })
		.then(channel => {
			client.settings.set(guild.id, channel.id, `musictextchannel`);
		});
};