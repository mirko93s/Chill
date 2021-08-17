const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const fetch = require("node-fetch");
const { fancyNumber } = require("../../functions.js");

module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "Other",
    description: "Find out some nice instagram statistics",
    usage: "instagram <username>\n**e.g.**\n\`instagram randomusername\`\n> will show some info about an instagram profile",
    run: async (client, msg, arg) => {

        const nonameEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide an instagram username!`)
        const noprofileEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find any instagram profile with that username!`)

        const name = arg.join(" ");
        if (!name) return msg.channel.send({embeds:[nonameEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        
        try {
            var account = (await fetch(`https://instagram.com/${name}/?__a=1`).then(res => res.json())).graphql.user;
        } catch (err) {
            console.log(err);
            return msg.channel.send({embeds:[noprofileEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        }

        const profileEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(account.is_verified ? account.username+" ✅" : account.username)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Profile information", stripIndents`
            **Full name:** ${account.full_name}
            **Biography:** ${account.biography.length == 0 ? "none" : `*${account.biography}*`}
            **Posts:** ${fancyNumber(account.edge_owner_to_timeline_media.count)}
            **Followers:** ${fancyNumber(account.edge_followed_by.count)}
            **Following:** ${fancyNumber(account.edge_follow.count)}
            **Private account:** ${account.is_private ? "Yes 🔐" : "Nope 🔓"}`);
        if (account.category_name !== null) profileEmbed.setDescription(account.category_name)

        msg.channel.send({embeds:[profileEmbed]});
    }
}