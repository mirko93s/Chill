/**
 * @param {Client} client
 * @param {Object} msg
 * @returns {Boolean}
 */
module.exports = function(client, msg) {
	const welcomechannel = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, `welcomechannel`)));
	const bcchannel = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, `bcchannel`)));
	const puchannel = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, `puchannel`)));
	const reportchannel = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, `reportchannel`)));
	const gachannel = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, `gachannel`)));
	const pollchannel = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, `pollchannel`)));
	const musicvocalchannel = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, `musicvocalchannel`)));
	const musictextchannel = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, `musictextchannel`)));
	const ticketcategory = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, `ticketcategory`)));
	const musictemprole = msg.guild.roles.cache.find(r => r.id === (client.settings.get(msg.guild.id, `musictemprole`)));
	const djrole = msg.guild.roles.cache.find(r => r.id === (client.settings.get(msg.guild.id, `djrole`)));
	const supportrole = msg.guild.roles.cache.find(r => r.id === (client.settings.get(msg.guild.id, `supportrole`)));
	const roleonjoin = msg.guild.roles.cache.find(r => r.id === (client.settings.get(msg.guild.id, `roleonjoin`)));
	if (!bcchannel || !puchannel || !reportchannel || !gachannel || !pollchannel || !mutedrole || !djrole || !welcomechannel || !musicvocalchannel || !musictextchannel || !ticketcategory || !musictemprole || !supportrole || !roleonjoin) return false;
	else return true;
};