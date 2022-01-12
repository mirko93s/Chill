const Discord = require("discord.js");
const AsciiTable = require('ascii-table');

module.exports = {
    name: "cmdstats",
    description: "Get command uses ranking",
    dev: true,
    options: null,
    run: async (client, interaction, arg) => {

        var commands = client.cmdstats.get('usage'); //get object
		var sorted = {};  

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
        var i = 0;
        for(const [cmd,count] of sorted) {
            i++;
            table.addRow(i,cmd,count);
        }

        const cmdEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`Command Uses`)
            .setDescription(`\`\`\`console\n${table.toString()}\n\`\`\``)

        if(cmdEmbed.description.length <= 4096) return interaction.reply({ephemeral:true, embeds: [cmdEmbed]});
            else {
                console.log(table.toString());
                return interaction.reply({ephemeral:true, content:'⚠️ List has been logged in the console because it is too long for an embed'});
            }
    }
}
