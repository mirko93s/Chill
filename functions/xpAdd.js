const Discord = require('discord.js');
/**
 * @param {Client} client 
 * @param {Object} msg 
 * @param {Set} talkedRecently 
 * @description Adds xp at each message sent by user with cooldown
 */
module.exports = function(client, msg, talkedRecently) {
    client.settings.ensure(msg.guild.id, {level: 0, points: 0}, `xp.${msg.author.id}`);
    client.settings.inc(msg.guild.id, `xp.${msg.author.id}.points`);
    const curLevel = Math.floor(0.3163 * Math.sqrt(client.settings.get(msg.guild.id, `xp.${msg.author.id}.points`)));
    if (client.settings.get(msg.guild.id, `xp.${msg.author.id}.level`) < curLevel) { //level up
        client.settings.set(msg.guild.id, curLevel, `xp.${msg.author.id}.level`);
        const newlevelembed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setAuthor({name:`Congratulations`, iconURL:msg.author.displayAvatarURL()})
            .setDescription(`${msg.member.user} **leveled up to Lvl ${curLevel}**!`)
        //check rewards
        var rewards = client.settings.get(msg.guild.id, `rewards`);
        var unlocked = "";
        for (const [key, value] of Object.entries(rewards)) {
            if (value == curLevel) {
                const checkrole = msg.guild.roles.cache.find(r => r.id === key); //check if role exists
                if (checkrole && msg.guild.me.roles.highest.position > checkrole.rawPosition) msg.member.roles.add(checkrole.id); //give role
                unlocked += `${msg.guild.roles.cache.find(r => r.id === key).name}\n`;
            }
        };
        if (unlocked.length > 0) newlevelembed.setDescription(`${msg.member.user} **leveled up to Lvl ${curLevel}**\n*and unlocked these roles:*\n***${unlocked}***`)
        msg.channel.send({embeds:[newlevelembed]});
    };
    talkedRecently.add(msg.author.id); //xp cooldown
    setTimeout(() => {
        talkedRecently.delete(msg.author.id);
    }, client.settings.get(msg.guild.id, "xpcooldown")*1e3);
}