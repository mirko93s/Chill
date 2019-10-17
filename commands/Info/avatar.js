module.exports = {
    name: "avatar",
    aliases: ["av"],
    category: "Fun",
    description: "Display user's avatar",
    usage: "[user-mention]",
    run: async (client, msg, arg) => {
        msg.delete();
        let user = arg[0];
        if (msg.mentions.users.size) {user = msg.mentions.users.first();}
        else user = msg.author
        if (arg[0] && !msg.mentions.users.first()) msg.reply("Please mention a valid user of the server.")
        else msg.channel.send({embed: {color: 123456,fields: [{name: 'Avatar',value: user.username}],image: {url: user.displayAvatarURL}}});
    }
}
