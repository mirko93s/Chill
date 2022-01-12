const Discord = require('discord.js');
/**
 * @param {Object} member 
 * @param {Object} guild 
 * @param {Boolean} join 
 * @returns {MessageEmbed}
 */
module.exports = function(member, guild, join = true) {
    let count = guild.memberCount.toString();
    if (count.endsWith('11') || count.endsWith('12') || count.endsWith('13')) count += 'th'
        else if (count.endsWith('1')) count += 'st';
            else if (count.endsWith('2')) count += 'nd';
                else if (count.endsWith('3')) count += 'rd';
                    else count += 'th';
    var message = [
        `${member.user} has joined.`,
        `${member.user} joined ${guild.name}.`,
        `Welcome, ${member.user}.`,
        `${member.user} is our 1,000,000th visitor. React for a free iPhone.`,
        `Let's all give a warm welcome to ${member.user}.`,
        `Wild ${member.user} appeared!`,
        `👋 ${member.user} 👋`,
        `Welcome ${member.user}, you are the ${count} member.`,
        `Hi ${member.user}, hope you will enjoy staying in our server. `,
        `Hello ${member.user}, we were expecting you.`,
        `●●●${member.user} is typing...`
    ];
    const welcomeEmbed = new Discord.MessageEmbed()
        .setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL()})
    if (join === true) welcomeEmbed.setColor('GREEN').setDescription(message[Math.floor(Math.random() * message.length)]);
    else if (join === false) welcomeEmbed.setColor('RED').setDescription(`${member.user} left the game.`);
        
    return welcomeEmbed;
}