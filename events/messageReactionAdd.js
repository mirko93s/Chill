module.exports = (client, msg, user) => {
 
    if (client.settings.has(msg.message.guild.id, `reactionroles.${msg.message.id}`)) {
        const role = msg.message.guild.roles.cache.find(r => r.id === client.settings.get(msg.message.guild.id, `reactionroles.${msg.message.id}.${msg._emoji.name}`));
        if (role) return msg.message.guild.members.cache.get(user.id).roles.add(role);
    }
}