const Discord = require("discord.js");

module.exports = {
    name: "command",
    aliases: ["cmd"],
    category: "Commands",
    description: "Enable/Disable a command on this server",
    usage: "command <enable|disable|list> [command name or alias if enable/disable]\n**e.g.**\n\`command disable ping\`\n> will disable the ping command on this server\n\`command enable ping\`\n> will enable again the ping command on this server\n\`command list\`\n> returns a list of all disabled commands on this server",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const noargsEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ Wrong arguments, Please type \`help command\` to check how to use this command!`)
        const nocmdEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command doesn't exist!`)
        const alreadydisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command is already disabled on this server!`)
        const alreadyenabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command is already enabled on this server!`)
        const nodisabledcmdsEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ There are no commands disabled on this server!`)
        
        if (arg[0] === "list") {
            const disabledcommands = client.settings.get(msg.guild.id, "disabledcommands");
            if (disabledcommands.length <= 0) return msg.channel.send({embeds:[nodisabledcmdsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            const disabledEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Disabled Commands')
            let disabledmsg = "";
            disabledcommands.forEach(cmd => {
                disabledmsg += (`\`${cmd}\` `);
            });
            disabledEmbed.setDescription(disabledmsg);
            return msg.channel.send({embeds:[disabledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 30000));
        }
        else if (arg[0] === "disable") {
            if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            if (!arg[1]) return msg.channel.send({emebds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            let command = client.commands.get(arg[1]);
            if (!command) command = client.commands.get(client.aliases.get(arg[1]));
            if (!command) return msg.channel.send({embeds:[nocmdEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            if (!client.settings.includes(msg.guild.id, command.name, "disabledcommands")) {
                client.settings.push(msg.guild.id, command.name, "disabledcommands");
                const disabledEmbed = new Discord.MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`❌ \`${command.name}\` has been disabled on this server.`)
                msg.channel.send({embeds:[disabledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10000));
            } else return msg.channel.send({embeds:[alreadydisabledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        }
        else if (arg[0] === "enable") {
            if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            if (!arg[1]) return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            let command = client.commands.get(arg[1]);
            if (!command) command = client.commands.get(client.aliases.get(arg[1]));
            if (!command) return msg.channel.send({embeds:[nocmdEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            if (client.settings.includes(msg.guild.id, command.name, "disabledcommands")) {
                client.settings.remove(msg.guild.id, command.name, "disabledcommands");
                const enabledEmbed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle(`✅ \`${command.name}\` has been enabled again on this server.`)
                msg.channel.send({embeds:[enabledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10000));
            } else return msg.channel.send({embeds:[alreadyenabledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        }
        else return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));


    }
}
