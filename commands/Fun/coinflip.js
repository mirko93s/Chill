const Discord = require("discord.js");

module.exports = {
    name: "coinflip",
    aliases: ["flipcoin", "cf", "fc", "headsortails", "ht"],
    category: "Fun",
    description: "Flips a coin",
    usage: "coinflip\n**e.g.**\n\`coinflip\`\n> The Bot will flip a coin for you\n> Heads or Tails?",
    run: async (client, msg, arg) => {
        msg.delete();
        var coin = ["Heads","Tails"];
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription("Flipping")

        const embed1 = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription("Flipping .")

        const embed2 = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription("Flipping . .")

        const embed3 = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription("Flipping . . .")

        const embed4 = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription(msg.author.toString() + " flipped **" + (coin[Math.floor(Math.random() * coin.length)]) + "**")

        const m = await msg.channel.send(embed);
        m.edit(embed1);
        m.edit(embed2);
        m.edit(embed3);
        m.edit(embed4);
    }
}
