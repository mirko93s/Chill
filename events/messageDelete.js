module.exports = (client, msg) => {
    if (client.settings.has(msg.guild.id, `reactionroles.${msg.id}`)) return client.settings.delete(msg.guild.id, `reactionroles.${msg.id}`);
}