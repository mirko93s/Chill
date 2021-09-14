const Discord = require("discord.js");
const config = require('../../config.json');
const AsciiTable = require('ascii-table');
const { alignCenter } = require("ascii-table");

module.exports = {
    name: "cmdstats",
    category: "Owner",
    description: "Get command uses ranking",
    usage: "cmdstats\n**e.g.**\n\`cmdstats\`\n> Return a list of all commands and how many times have been used",
    permission: "DEV",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)

        if (msg.author.id !== config.bot_owner) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        var commands = client.cmdstats.get('usage'); //get object
		var sorted = {};  

        var i = 0;

        Object //sort object
            .keys(commands).sort(function(a, b){
                return commands[b] - commands[a];
            })
            .forEach(function(key) {
                sorted[key] = commands[key];
            });
            
        var table = new AsciiTable()
            .setHeading('#', 'Command', 'Uses')
            .setAlign(0, AsciiTable.CENTER)
            .setAlign(1, AsciiTable.CENTER)
            .setAlign(2, AsciiTable.CENTER)

		sorted = Object.keys(sorted).map((key) => [key, sorted[key]]);
        for(const [cmd,count] of sorted) {
            i++;
            table.addRow(i,cmd,count);
        }

        const cmdEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`Command Uses`)
            .setDescription(`\`\`\`console\n${table.toString()}\n\`\`\``)

        return msg.channel.send({embeds: [cmdEmbed]});
    }
}
