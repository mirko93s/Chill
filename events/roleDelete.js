module.exports = (client, oldRole) => {
    if (client.settings.has(oldRole.guild.id, `rewards.${oldRole.id}`)) return client.settings.delete(oldRole.guild.id, `rewards.${oldRole.id}`); //remove role from rewards db if deleted
}