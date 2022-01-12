/**
 * @param {Client} client 
 * @param {Object} guild @requires
 * @description creates deafult channels, roles, etc on guild join
 */
module.exports = async function(client, guild) {
// roles
await guild.roles.create({ name: "Listening",permissions: [], color: 'CCCC00'})
    .then(role => {client.settings.set(guild.id, role.id, "musictemprole")});
guild.roles.create({ name: "DJ",permissions: ['CONNECT'], color: 'D00091'})
    .then(role => {client.settings.set(guild.id, role.id, "djrole")});
guild.roles.create({ name: "Staff",permissions: [], color: 'FC72F3'})
    .then(role => {client.settings.set(guild.id, role.id, "supportrole")});
guild.roles.create({ name: "Member",permissions: ['VIEW_CHANNEL'], color: '33FFFF'})
    .then(role => {client.settings.set(guild.id, role.id, "roleonjoin")});
// channels
guild.channels.create("🎫tickets", {type: 'GUILD_CATEGORY'})
    .then(channel => {client.settings.set(guild.id, channel.id, "ticketcategory")});
guild.channels.create("👋welcome", {type: 'GUILD_TEXT', 
    permissionOverwrites: [{id: guild.roles.everyone.id, 
    deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
    .then(channel => {client.settings.set(guild.id, channel.id, "welcomechannel")});
guild.channels.create("📢announcements", {type: 'GUILD_TEXT', 
    permissionOverwrites: [{id: guild.roles.everyone.id, 
    deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
    .then(channel => {client.settings.set(guild.id, channel.id, "bcchannel")});
guild.channels.create("🔨punishments", {type: 'GUILD_TEXT', 
    permissionOverwrites: [{id: guild.roles.everyone.id, 
    deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
    .then(channel => {client.settings.set(guild.id, channel.id, "puchannel")});
guild.channels.create("🚨reports", {type: 'GUILD_TEXT', 
    permissionOverwrites: [{id: guild.roles.everyone.id, 
    deny: [`VIEW_CHANNEL`]}]})
    .then(channel => {client.settings.set(guild.id, channel.id, "reportchannel")});
guild.channels.create("🎉giveaway", {type: 'GUILD_TEXT', 
    permissionOverwrites: [{id: guild.roles.everyone.id, 
    deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
    .then(channel => {client.settings.set(guild.id, channel.id, "gachannel")});
guild.channels.create("💡poll", {type: 'GUILD_TEXT', 
    permissionOverwrites: [{id: guild.roles.everyone.id, 
    deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
    .then(channel => {client.settings.set(guild.id, channel.id, "pollchannel")});
guild.channels.create("🔊music", {type: 'GUILD_VOICE',
    permissionOverwrites: [{id: guild.roles.everyone.id, 
    deny: ['SPEAK']}]})
    .then(channel => {client.settings.set(guild.id, channel.id, "musicvocalchannel")});
guild.channels.create("🎵song-request", {type: 'GUILD_TEXT', 
    permissionOverwrites: [
    {id: guild.id, 
    deny: ['VIEW_CHANNEL']},
    {id: client.settings.get(guild.id, "musictemprole"),
    allow: ['VIEW_CHANNEL','SEND_MESSAGES']}]})
    .then(channel => {client.settings.set(guild.id, channel.id, "musictextchannel")});    
}