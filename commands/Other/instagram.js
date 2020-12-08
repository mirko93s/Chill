const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const fetch = require("node-fetch");

module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "Other",
    description: "Find out some nice instagram statistics",
    usage: "instagram <username>\n**e.g.**\n\`instagram randomusername\`\n> will show some info about an instagram profile",
    run: async (client, msg, arg) => {
        msg.delete();
        const name = arg.join(" ");

        if (!name) {
            return msg.reply("Please provide a name.")
                .then(m => m.delete({timeout:5000}));
        }

        const url = `https://instagram.com/${name}/?__a=1`;
        
        let res; 

        try {
            res = await fetch(url).then(url => url.json());
        } catch (e) {
            return msg.reply("I couldn't find any account with that name.")
                .then(m => m.delete({timeout:5000}));
        }

        const account = res.graphql.user;

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(account.full_name)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Profile information", stripIndents`**Username:** ${account.username}
            **Full name:** ${account.full_name}
            **Biography:** ${account.biography.length == 0 ? "none" : account.biography}
            **Posts:** ${account.edge_owner_to_timeline_media.count}
            **Followers:** ${account.edge_followed_by.count}
            **Following:** ${account.edge_follow.count}
            **Private account:** ${account.is_private ? "Yes 🔐" : "Nope 🔓"}`);

        msg.channel.send(embed);
    }
}