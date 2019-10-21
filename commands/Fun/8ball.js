const Discord = require("discord.js");

module.exports = {
    name: "8ball",
    aliases: ["8b"],
    category: "Fun",
    description: "Ask a yes-or-no question to the bot",
    usage: "<question>",
    run: async (client, msg, arg) => {

        msg.delete();

        const noquestionEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please ask me a question`)

        var fortunes = ["It is certain.","It is decidedly so.","Without a doubt.","Yes - definitely.","You may rely on it.","As I see it, yes.","Most likely.",
        "Outlook good.","Yes.","Signs point to yes.","Reply hazy, try again.","Ask again later","Better not tell you now.","Cannot predict now.",
        "Concentrate and ask again","Don't count on it.","My reply is no.","My sources say no.","Outlook not so good.","Very doubtful."];
        let question = arg.join(" ");
        if (!question) return msg.channel.send(noquestionEmbed).then(msg => msg.delete(5000));
        //if (arg[0]) msg.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
        else {
            let answer = fortunes[Math.floor(Math.random() * fortunes.length)];
            const embed = new Discord.RichEmbed()
                .setColor ('RANDOM')
                .setTitle(":8ball: **8 Ball**")
                .setDescription(`*${question}*\n**${answer}**`)
            msg.channel.send(embed);
        }
    }
}
