const Discord = require("discord.js");

module.exports = {
    name: "slotmachine",
    aliases: ["slot"],
    category: "Fun",
    description: "Play a slot machine",
    usage: "slotmachine\n**e.g.**\n\`slotmachine\`\n> No real money are used :D",
    run: async (client, msg, arg) => {
        
        const choices = ['🍇','🍒','🍋','🍊'];
        var slots = [];

        for (i=1; i<10; i++) {
            slots[i] = choices[Math.floor(Math.random() * choices.length)];
        }

        const slotEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .addField(`🎰 **Chill Slot** 🎰`,`${slots[1]}|${slots[2]}|${slots[3]}`)
            .addField(`${slots[4]}|${slots[5]}|${slots[6]}`, `${slots[7]}|${slots[8]}|${slots[9]}`)

        if (slots[1] === slots[2] && slots[1] === slots[3] || slots[4] === slots[5] && slots[4] === slots[6] || slots[7] === slots[8] && slots[7] === slots[9]) {
            slotEmbed.setFooter("Wow! **" + msg.author.username + "** won great job!");
        } else {
            slotEmbed.setFooter("Awww **" + msg.author.username + "** lost that sucks!");
        }
        msg.channel.send(slotEmbed);
    }
}
