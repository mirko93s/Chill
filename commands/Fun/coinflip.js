const Discord = require("discord.js");

module.exports = {
    name: "coinflip",
    aliases: ["flipcoin", "cf", "fc", "headsortails", "ht"],
    category: "Fun",
    description: "Flips a coin",
    usage: "coinflip\n**e.g.**\n\`coinflip\`\n> The Bot will flip a coin for you\n> Heads or Tails?",
    run: async (client, msg, arg) => {

        var coin = ["Heads","Tails"];
        const flippingEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription("Flipping . . .")
        const flippedEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription(msg.author.toString() + " flipped **" + (coin[Math.floor(Math.random() * coin.length)]) + "**")

        await msg.channel.send(flippingEmbed).then(m => {
            setTimeout(() => {
                m.edit(flippedEmbed)       
            }, 500);
        });
    }
}
