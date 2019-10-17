const Discord = require("discord.js");

module.exports = {
    name: "nickname",
    aliases: ["nick"],
    category: "Other",
    description: "Change a member's nickname",
    usage: "<mention> <new nickname>",
    run: async (client, msg, arg) => {
        if (!msg.member.hasPermission("MANAGE_NICKNAMES")) return msg.reply("You do not have permission to change the bot's nickname");
      if (!msg.guild.member(client.user).hasPermission('MANAGE_NICKNAMES')) return msg.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_NICKNAMES. :x:')
      if (msg.mentions.users.size < 1) return msg.reply('You must mention someone to change the users nickname. :x:')
      let user = msg.guild.member(msg.mentions.users.first());
      if (user.highestRole.position >= msg.member.highestRole.position ) return msg.reply('I cant change that members nickname. They are the same level as you or higher. :x:');
      let newusername = arg.slice(1).join(' ')
      if (newusername.length < 1) return msg.reply('You must supply a new name for the user.')
       msg.guild.members.get(user.user.id).setNickname(newusername);
        const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .addField("Username set successfully!", newusername + " is now the nickname for " + user.user.username + " :white_check_mark:");
        msg.reply({embed})
    }
}
