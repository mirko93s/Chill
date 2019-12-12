const Discord = require("discord.js");
const mirko_ip = (`mc.mirko93s.it`);

module.exports = {
    name: "mcstat",
    aliases: ["mc", "minecraft"],
    category: "Other",
    description: "Get Minecraft server banner",
    usage: "<ip | ip:port | host address | blank for default server>",
    run: async (client, msg, arg) => {
        msg.delete();
        let serverip = msg.content.split(' ').splice(1).join(' ');
			let serverip_fromfield = serverip.substring(0,serverip.indexOf(":"));
            let serverport_fromfield = serverip.split(':')[1];
            
			if (!serverip) serverip = mirko_ip;
			
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
            
            const embed = new Discord.RichEmbed()
            .setAuthor("Minecraft Server Status",icon_url="https://gamepedia.cursecdn.com/minecraft_gamepedia/4/44/Grass_Block_Revision_6.png?version=6fbedf976222daab354767540ccff4a1")
            .setTitle(`***${serverip}***`)
            .setColor(`RANDOM`)
            .setImage("http://status.mclive.eu/Server/" + serverip_final + "/" + serverport_final + "/banner.png")

            msg.channel.send({embed});
    }
}
