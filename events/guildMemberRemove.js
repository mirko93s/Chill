const { updateServerStats } = require("../functions.js");

module.exports = (client, member) => {
    if(client.settings.has(member.guild.id, `xp.${member.id}`)) client.settings.delete(member.guild.id, `xp.${member.id}`);
    if (client.settings.has(member.guild.id, "usercounter")) updateServerStats(client, member); //update server stats counter
};