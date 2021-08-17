const Discord = require("discord.js");

module.exports = {
    name: "customcommandremove",
    aliases: ["ccremove"],
    category: "Commands",
    description: "Delete a custom command",
    usage: "customcommandremove <command-name>\n**e.g.**\n\`customcommandremove randomcommand\`\n> It will delete the custom command named `randomcommand`",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const noargsEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ Please provide a valid custom command in order to delete it!`)
        const nocmdEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command doesn't exist on this server!`)
            
        if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        if (!arg[0]) return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        let command = arg[0].toLowerCase();

        if(!client.settings.has(msg.guild.id, `customcmd.${command}`)) return msg.channel.send({embeds:[nocmdEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        client.settings.delete(msg.guild.id, `customcmd.${command}`);
        const deletedEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Custom Commands')
            .setDescription(`Custom command \`${command}\` has been deleted.`)
        msg.channel.send({embeds:[deletedEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10000));
        
    }
}
