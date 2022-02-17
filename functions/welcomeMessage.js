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
        `A Wild ${member.user} appeared!`,
        `👋 ${member.user} 👋`,
        `Welcome ${member.user}, you are the ${count} member.`,
        `Hi ${member.user}, hope you will enjoy staying in our server. `,
        `Hello ${member.user}, we were expecting you.`,
        `●●●${member.user} is typing...`,
        `${member.user} joined your party.`,
        `Swoooosh. ${member.user} just landed.`,
        `${member.user} hopped into the server.`,
        `Where’s ${member.user}? In the server!`,
        `${member.user} just showed up. Hold my beer.`,
        `Big ${member.user} showed up!`,
        `A ${member.user} has spawned in the server!`,
        `Welcome, ${member.user}. Hope you brought pizza.`,
        `${member.user} just joined the server - glhf!`,
        `${member.user} just joined. Everyone, look busy!`,
        `${member.user} just joined. Can I get a heal?`,
        `${member.user} joined. You must construct additional pylons.`,
        `Ermagherd. ${member.user} is here.`,
        `Welcome, ${member.user}. Stay awhile and listen.`,
        `Welcome, ${member.user}. We were expecting you ( ͡° ͜ʖ ͡°)`,
        `Welcome ${member.user}. Leave your weapons by the door.`,
        `Brace yourselves. ${member.user} just joined the server.`,
        `${member.user} just slid into the server.`,
        `Challenger approaching - ${member.user} has appeared!`,
        `It's a bird! It's a plane! Nevermind, it's just ${member.user}.`,
        `Ha! ${member.user} has joined! You activated my trap card!`,
        `Cheers, love! ${member.user}'s here!`,
        `Hey! Listen! ${member.user} has joined!`,
        `We've been expecting you ${member.user}`,
        `It's dangerous to go alone, take ${member.user}!`,
        `${member.user} has joined the server! It's super effective!`,
        `${member.user} is here, as the prophecy foretold.`,
        `${member.user} has arrived. Party's over.`,
        `Ready player ${member.user}.`,
        `${member.user} is here to kick butt and chew bubblegum. And ${member.user} is all out of gum.`,
        `Hello. Is it ${member.user} you're looking for?`,
        `Roses are red, violets are blue, ${member.user} joined this server with you.`,
        `${member.user} just arrived. Seems OP - please nerf.`,
        `${member.user} just joined. Hide your bananas.`,
        `It's ${member.user}! Praise the sun!`,
        `Never gonna give ${member.user} up. Never gonna let ${member.user} down.`,
        `${member.user} has joined. Stay a while and listen!`,
    ];
    const welcomeEmbed = new Discord.MessageEmbed()
        .setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL()})
    if (join === true) welcomeEmbed.setColor('GREEN').setDescription(message[Math.floor(Math.random() * message.length)]);
    else if (join === false) welcomeEmbed.setColor('RED').setDescription(`${member.user} left the game.`);
        
    return welcomeEmbed;
}