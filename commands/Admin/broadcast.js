const Discord = require("discord.js");

module.exports = {
    name: "broadcast",
    aliases: ["bc"],
    category: "Admin",
    description: "Broadcast a message",
    usage: "<title> <description>",
    run: async (client, msg, arg) => {
        msg.delete();
        var filter = m => m.author.id === msg.author.id;
        var title;
        var description;

        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply("Sorry, you don't have permission to use this!")

        const titleembed = new Discord.RichEmbed()
        .setColor('GREEN')
        .setTitle("🔴Broadcast")
        .setDescription("Enter the title:")
        .setFooter('max 256 characters');

        const descriptionembed = new Discord.RichEmbed()
        .setColor('GREEN')
        .setTitle("🔴Broadcast")
        .setDescription("Now enter the description:")
        .setFooter('max 2048 characters');

        const timeembed = new Discord.RichEmbed()
        .setColor('RED')
        .setTitle("🔴 Broadcast")
        .setDescription("OUT OF TIME!")

        msg.channel.send(titleembed)
            
            .then(msg => {//collect title
            msg.channel.awaitMessages(filter, {max: 1,time: 60000,errors: ['time']})
                .then(collected => {
                title = collected.first().content
                collected.first().delete();
                msg.edit(descriptionembed)
                    
                    .then(msg => {//collect description
                    msg.channel.awaitMessages(filter, {max: 1,time: 60000,errors: ['time']})
                        .then(collected => {
                        description = collected.first().content;
                        collected.first().delete();
                        msg.delete();
                            
                            try {//send broadcast
                                let bcEmbed = new Discord.RichEmbed()
                                .setTitle(title)
                                .setDescription(description)
                                .setColor("#00ff00")
                                .setAuthor(msg.author.username, msg.author.displayAvatarURL)    
                                let bcchannel = msg.guild.channels.find(bcchannel => bcchannel.name === "🔴broadcast");
                                if(!bcchannel) return msg.channel.send("Can't find broadcast channel.");
                                bcchannel.send("@everyone");
                                bcchannel.send(bcEmbed);
                                } 

                                catch(err) {//bot no perm error
                                msg.channel.send(`:heavy_multiplication_x:| **I don't have permission**`);
                                console.log(err);
                                }

                        }).catch(err => {//title time error
                            msg.edit(timeembed);
                            msg.delete(5000);
                            console.log(err);
                            });
                    }).catch(err => console.log(err));

                }).catch(err => {//description time error
                    msg.edit(timeembed);
                    msg.delete(5000);
                    console.log(err);
                    });
            }).catch(err => console.log(err));
    }
}
