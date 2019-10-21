const Discord = require("discord.js");

module.exports = {
    name: "flipcoin",
    aliases: ["coinflip", "cf", "fc", "headsortails", "ht"],
    category: "Fun",
    description: "Flip a coin",
    run: async (client, msg, arg) => {
        msg.delete();
        var coin = ["Heads","Tails"];
        const embed = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription("Flipping")

        const embed1 = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription("Flipping .")

        const embed2 = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription("Flipping . .")

        const embed3 = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setTitle("Coin Flip")
            .setDescription("Flipping . . .")

        const embed4 = new Discord.RichEmbed()
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
