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
            
        if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        
        if (!arg[0] || !arg[1]) return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        let command = arg[0].toLowerCase().toString();
        let response = arg.slice(1).join(' ').toString();

        client.settings.ensure(msg.guild.id, {customcmd: {}});

        client.settings.set(msg.guild.id, response, `customcmd.${command}`);

        const okEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Custom Commands')
            .setDescription(`New custom command created\n**Command:** \`${command}\`\n**Response:** \`${response}\``)
        msg.channel.send({embeds:[okEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10000));
        
    }
}
