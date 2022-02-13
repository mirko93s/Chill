const Discord = require("discord.js");

module.exports = {
    name: "8ball",
    description: "Ask a question, the Bot will answer you",
    options: [
        {
            name: 'question',
            description: 'Ask a question',
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {

        const tooLongEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('⛔ Question must be shorter than 3072 characters')

        var fortunes = ["It is certain.","It is decidedly so.","Without a doubt.","Yes - definitely.","You may rely on it.","As I see it, yes.","Most likely.",
        "Outlook good.","Yes.","Signs point to yes.","Reply hazy, try again.","Ask again later","Better not tell you now.","Cannot predict now.",
        "Concentrate and ask again","Don't count on it.","My reply is no.","My sources say no.","Outlook not so good.","Very doubtful."];

        const question = interaction.options.getString('question');
        if (question.length > 3072) return interaction.reply({ephemeral:true, embeds:[tooLongEmbed]});
        const answer = fortunes[Math.floor(Math.random() * fortunes.length)];
        const embed = new Discord.MessageEmbed()
            .setColor ('RANDOM')
            .setTitle("🎱 **8 Ball**")
            .setDescription(`*${question}*\n**${answer}**`)
        interaction.reply({embeds:[embed]});
    }
}
