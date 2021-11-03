/**
 * 
 * @param {Client} client 
 * @param {Object} member 
 */
module.exports = function (client, member) {
    if (client.serverstatscooldown.has(member.guild.id)) return;
    const usercounterchannel = member.guild.channels.cache.find(c => c.id === (client.settings.get(member.guild.id, "usercounter"))); //check if channel still exists
    if (usercounterchannel) {
        var memberCount = member.guild.members.cache.filter(member => !member.user.bot).size;
        const fancyNumber = require('./functions').fancyNumber;
        memberCount = fancyNumber(memberCount);
        usercounterchannel.setName(`📊Users: ${memberCount}`);
        client.serverstatscooldown.add(member.guild.id); // cooldown
        setTimeout(() => {
            client.serverstatscooldown.delete(member.guild.id);
        }, 15*60*1000);
    } else { //if channel doesnt exist delete usercounter from db disabling the feature
        client.settings.delete(member.guild.id, "usercounter");
    }
}