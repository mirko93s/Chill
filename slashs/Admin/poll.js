const Discord = require("discord.js");

module.exports = {
    name: "poll",
    description: "Start a multiple choice poll",
    userPerms: ['MANAGE_GUILD'],
    botPerms: ['VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS','ADD_REACTIONS','READ_MESSAGE_HISTORY'],
    options: [
        {
            name: 'question',
            description: 'What is the poll about?',
            type: 'STRING',
            required: true,
        },
        {
            name: 'choices',
            description: 'Provide at least 2 choices (max 10) separated by commas',
            type: 'STRING',
            required: true,
        },
        {
            name: 'channel',
            description: 'Channel to send the poll to. If blank defaults to Guild Config Poll channel',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT'],
        },
    ],
    run: async (client, interaction, arg) => {

        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Poll channel not found`)
        const wrongchoicesEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide at least 2 choices to start a poll`)
            .setFooter({text: `max 10 choices, use commas to separate choices`})
        const noquestionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Question must be shorter than 256 characters`)
        const tooLongEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ The sum of all choices can't be longer than 4096 characters`)
            
        var emoji = ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🫐','🍓','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🥒']
        var choicemsg = "";
        
        let pollchannel = interaction.options.getChannel('channel') || interaction.guild.channels.cache.find(pollchannel => pollchannel.id === (client.settings.get(interaction.guild.id, "pollchannel")));
        if(!pollchannel) return interaction.reply({ephemeral:true, embeds:[nochannelEmbed]});
        
        let question = interaction.options.getString('question');
        if (question.length > 256) return interaction.reply({ephemeral:true, embeds:[noquestionEmbed]});

        let choices = interaction.options.getString('choices');
            
        if (choices.endsWith(",") === true) choices = choices.slice(0,(choices.length-1)); //remove last "," from choices string
        choices = choices.split(","); //convert choices to an array
        if (choices.length > 10 || choices.length < 2) return interaction.reply({ephemeral:true, embeds:[wrongchoicesEmbed]});

        for (var i = emoji.length - 1; i > 0; i--) { //scramble emoji array
            var j = Math.floor(Math.random() * (i + 1));
            var temp = emoji[i];
            emoji[i] = emoji[j];
            emoji[j] = temp;
        }

        for (var i=0; i<choices.length; i++) { //prepare choice msg
            choicemsg += `${emoji[i]} ${choices[i]}\n`;
        }
        let pollEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${question}`)
            .setDescription(`**React to vote**\n`+choicemsg)
            .setTimestamp()

        if (pollEmbed.description.length > 4096) return interaction.reply({ephemeral:true, embeds:[tooLongEmbed]})

        pollchannel.send({embeds:[pollEmbed]}).then(msg => {
            const doneEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`✅ Poll started in ${pollchannel}`)
            interaction.reply({ephemeral:true, embeds:[doneEmbed]});
            for (var i = 0; i < choices.length; i++) { 
                msg.react(emoji[i]);
            }
        });
    }
}