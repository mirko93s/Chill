const Discord = require("discord.js");

module.exports = {
    name: "poll",
    category: "Admin",
    description: "Start a multiple choice poll in the preset channel",
    usage: "poll <question>\n**e.g.**\n\`poll What is your favourite fruit?\`\n> Then input the choices, separated by commas \`,\`\n> It will create a multiple choice poll in the \"poll-channel\" with the question \"What is your favourite food ?\"\n> Then people can vote 1 or more of your inputted choices",
    permission: "MANAGE_GUILD",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Poll channel not found`)
        const wrongchoicesEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide at least 2 choices to start a poll`)
            .setFooter(`max 10 choices, use commas to separate choices`)
        const noquestionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a question to start a poll`)
            .setFooter(`Question must be longer than 10 characters`)
        const askchoicesEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`Poll setup`)
            .setDescription(`**Input the choices separated by commas**`)
        const outoftimeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ No answer after 30 seconds, operation canceled.`)
            
        var filter = m => m.author.id === msg.author.id;
        var choices;
        var emoji = ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🫐','🍓','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🥒']
        var choicemsg = "";

        if(!msg.guild.member(msg.author).hasPermission('MANAGE_GUILD')) return msg.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        let pollchannel = msg.guild.channels.cache.find(pollchannel => pollchannel.id === (client.settings.get(msg.guild.id, "pollchannel")));
        if(!pollchannel) return msg.channel.send(nochannelEmbed).then(msg => msg.delete({ timeout: 5000 }));

        let question = arg.join(" ");
        if (!question) return msg.channel.send(noquestionEmbed).then(msg => msg.delete({ timeout: 5000 }));

        msg.channel.send(askchoicesEmbed).then(msg => {
            msg.channel.awaitMessages(filter, {max: 1,time: 30000,errors: ['time']}).then(collected => {
                choices = collected.first().content;
                collected.first().delete()
                msg.delete();
                if (choices.endsWith(",") === true) choices = choices.slice(0,(choices.length-1)); //remove last "," from choices string
                choices = choices.split(","); //convert choices to an array
                if (choices.length > 10 || choices.length < 2) return msg.channel.send(wrongchoicesEmbed).then(msg => msg.delete({ timeout: 5000 })); //choices can't be > 10

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

                pollchannel.send(pollEmbed).then(msg => {
                    for (var i = 0; i < choices.length; i++) { 
                        msg.react(emoji[i]);
                    }
                });
            }).catch(() => {return msg.edit(outoftimeEmbed).then(msg => msg.delete({ timeout: 5000 }));});
        });       
    }
}