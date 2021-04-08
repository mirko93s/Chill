module.exports = (client, channel) => {
    if (client.settings.includes(channel.guild.id, channel.id, "autovocalchannels")) return client.settings.remove(channel.guild.id, channel.id, "autovocalchannels");
}