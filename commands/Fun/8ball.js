const Discord = require("discord.js");

module.exports = {
    name: "8ball",
    aliases: ["8b"],
    category: "Fun",
    description: "Ask a question, the Bot will answer you",
    usage: "8ball <question>\n**e.g.**\n\`8ball is this bot cool?\`\n> For better results you should only ask questions which can be answered with a simple yes or no\n> Based on the popular 1950 Magic 8-Ball game",
    run: async (client, msg, arg) => {

        msg.delete();

        const noquestionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please ask me a question`)

        var fortunes = ["It is certain.","It is decidedly so.","Without a doubt.","Yes - definitely.","You may rely on it.","As I see it, yes.","Most likely.",
        "Outlook good.","Yes.","Signs point to yes.","Reply hazy, try again.","Ask again later","Better not tell you now.","Cannot predict now.",
        "Concentrate and ask again","Don't count on it.","My reply is no.","My sources say no.","Outlook not so good.","Very doubtful."];
        let question = arg.join(" ");
        if (!question) return msg.channel.send(noquestionEmbed).then(msg => msg.delete({ timeout: 5000 }));
        //if (arg[0]) msg.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
        else {
            let answer = fortunes[Math.floor(Math.random() * fortunes.length)];
            const embed = new Discord.MessageEmbed()
                .setColor ('RANDOM')
                .setTitle(":8ball: **8 Ball**")
                .setDescription(`*${question}*\n**${answer}**`)
            msg.channel.send(embed);
        }
    }
}
