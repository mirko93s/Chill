const Discord = require("discord.js");
const fs = require("fs")
const os = require('os')
const cpuStat = require("cpu-stat");
const package = require('../../package.json');

module.exports = {
    name: "botinfo",
    aliases: ["bot"],
    category: "Bot",
    description: "Shows some bot statistics",
    usage: "botinfo\n**e.g.**\n> \`botinfo\`\n> It will show you some cool satistics, such cpu/ram usage, number of servers/users, etc...",
    run: async (client, msg, arg) => {
        msg.delete();
        cpuStat.usagePercent(function(err, percent, seconds) {
            if (err) {
              return console.log(err);
            }
            const embed = new Discord.RichEmbed()
                .setAuthor(client.user.username)
                .setColor(`RANDOM`)
                .setThumbnail(client.user.avatarURL)
                .addField('Bot Created', client.user.createdAt.toLocaleString(), true)//
                .addField('Total Servers', Math.ceil(client.guilds.size), true)
                .addField('Total Users', `${client.users.size}`, true)
                .addField('Total Channels:', `${client.channels.size}`, true)
                .addField('Library', `discord.js v${package.dependencies["discord.js"]}`, true)//
                .addField('Node.js Version', process.version, true)
                .addField('Bot Version', `${package.version}`, true)
                .addField("CPU", `\`\`\`${os.cpus().map(i => `${i.model}`)[0]}\`\`\``, true)//
                .addField("CPU usage", `\`${percent.toFixed(2)}%\``,true)//
                .addField("RAM", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``, true)
                .addField("Arch", `\`${os.arch()}\``,true)//
                .addField("Platform", `\`${os.platform()} ${os.release}\``,true)
                .setTimestamp()
                .setFooter(client.user.username, client.user.avatarURL);
            msg.channel.send({embed}) 
        })
    }
}
