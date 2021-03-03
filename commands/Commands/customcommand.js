const Discord = require("discord.js");

module.exports = {
    name: "customcommand",
    aliases: ["cc"],
    category: "Commands",
    description: "Creates a new custom command",
    usage: "customcommand <command-name> <text-response>\n**e.g.**\n\`customcommand Hello World!\`\n> It will create a new custom command named `Hello`\nWhen you will run it his answer will be `World!`\nCommand name maust be one world without spaces like any other command.\nYou can use any text as response, including emojis, links, etc...",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const noargsEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ Please provide a valid name and a valid response in order to create a new custom command!`)
            
        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        
        if (!arg[0] || !arg[1]) return msg.channel.send(noargsEmbed).then(msg => msg.delete({ timeout: 5000 }));

        let command = arg[0].toLowerCase();
        let response = arg.slice(1).join(' ');

        client.customcmd.set(msg.guild.id, response, `${command}`);
        const okEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Custom Commands')
            .setDescription(`New custom command created\n**Command:** \`${command}\`\n**Response:** \`${response}\``)
        msg.channel.send(okEmbed).then(msg => msg.delete({ timeout: 10000 }));
        
    }
}
