module.exports = (client, msg, user) => {

    if (client.settings.has(msg.message.guildId, `reactionroles.${msg.message.id}`) && !user.bot) {
        if (user.bot) return;
        const role = msg.message.guild.roles.cache.find(r => r.id === client.settings.get(msg.message.guildId, `reactionroles.${msg.message.id}.${msg._emoji.name}.role`));
        if (role) return msg.message.guild.members.cache.get(user.id).roles.add(role).catch(err => {return})
    }
}