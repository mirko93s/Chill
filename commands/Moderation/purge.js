const Discord = require("discord.js");

module.exports = {
    name: "purge",
    aliases: ["clear"],
    category: "Moderation",
    description: "Get rid of many messages with one command",
    usage: "purge <2 to 100>\n**e.g.**\n\`purge 25\`\n> will delete the last 25 messages in the channel\n> Due to Discord API limitations you can only bulk delete a number of messages between 2 and 100",
    permission: "MANAGE_MESSAGES",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const invalidEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a number between 2 and 100`)
            .setFooter(`Due to Discord API you can't delete more than 100 messages at a time`)
                
        if (!msg.member.permissions.has("MANAGE_MESSAGES")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        const deleteCount = parseInt(arg[0], 10);

        const purgeEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`♻️ ${deleteCount} messages deleted`)

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) return msg.channel.send({embeds:[invalidEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        
        const fetched = await msg.channel.messages.fetch({limit: deleteCount});
        msg.channel.bulkDelete(fetched).catch(error => console.log(error));
        
        msg.channel.send({embeds:[purgeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
    }
}
