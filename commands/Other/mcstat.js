const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "mcstat",
    aliases: ["mc", "minecraft"],
    category: "Other",
    description: "Get Minecraft server banner",
    usage: "mcstat [ip | ip:port | host address]\n**e.g.**\n\`mcstat\`\n> will return the default server banner, set in the config file\n\`mcstat play.randomminecraftserver.com\`\n> will return the banner of that server\n> You can use ips, ips:port, addresses",
    run: async (client, msg, arg) => {
        
        let serverip = msg.content.split(' ').splice(1).join(' ');
        let serverip_fromfield = serverip.substring(0,serverip.indexOf(":"));
        let serverport_fromfield = serverip.split(':')[1];
        
        if (!serverip) serverip = config.mc_default_ip
        
        if (!serverip.includes(":")) {
            serverip_final = serverip;
        } else {
            serverip_final = serverip_fromfield;
        }
        
        if (!serverport_fromfield) {
            var serverport_final = "25565";
        } else {
            var serverport_final = serverport_fromfield;
        }
        
        const embed = new Discord.MessageEmbed()
            .setAuthor("Minecraft Server Status",icon_url="https://i.imgur.com/BupabSS.png")
            .setTitle(`***${serverip}***`)
            .setColor(`RANDOM`)
            .setImage("http://status.mclive.eu/Server/" + serverip_final + "/" + serverport_final + "/banner.png")

        msg.channel.send({embeds:[embed]});
    }
}
