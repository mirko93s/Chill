const Discord = require("discord.js");

module.exports = {
    name: "8ball",
    aliases: ["8b"],
    category: "Fun",
    description: "Ask a yes-or-no question to the bot",
    usage: "<question>",
    run: async (client, msg, arg) => {
        var fortunes = ["It is certain.","It is decidedly so.","Without a doubt.","Yes - definitely.","You may rely on it.","As I see it, yes.","Most likely.",
        "Outlook good.","Yes.","Signs point to yes.","Reply hazy, try again.","Ask again later","Better not tell you now.","Cannot predict now.",
        "Concentrate and ask again","Don't count on it.","My reply is no.","My sources say no.","Outlook not so good.","Very doubtful."];
        if (!arg[0]) return msg.delete();
        //if (arg[0]) msg.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
        if (arg[0]) {
            let answer = fortunes[Math.floor(Math.random() * fortunes.length)];
            const embed = new Discord.RichEmbed()
            .setColor ('RANDOM')
            .setTitle(":8ball: **8 ball**")
            .setDescription(answer)
            msg.channel.send(embed);
        }
        else msg.channel.send(":x: " + "| I wasn't able to read that :(");
    }
}
