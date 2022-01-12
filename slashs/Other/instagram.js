const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const fetch = require("node-fetch");

module.exports = {
    name: "instagram",
    description: "Find out some nice instagram statistics",
    options: [
        {
            name: "username",
            description: "Account username to look for",
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {

        const nonameEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide an instagram username!`)
        const noprofileEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find any instagram profile with that username!`)

        const name = interaction.options.getString('username');
        if (!name) return interaction.reply({ephemeral:true, embeds:[nonameEmbed]});
        
        try {
            var account = (await fetch(`https://instagram.com/${name}/?__a=1`).then(res => res.json())).graphql.user;
        } catch (err) {
            console.log(err);
            return interaction.reply({ephemeral:true, embeds:[noprofileEmbed]});
        }

        const profileEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(account.is_verified ? account.username+" ✅" : account.username)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Profile information", stripIndents`
            **Full name:** ${account.full_name}
            **Biography:** ${account.biography.length == 0 ? "none" : `*${account.biography}*`}
            **Posts:** ${client.chill.fancyNumber(account.edge_owner_to_timeline_media.count)}
            **Followers:** ${client.chill.fancyNumber(account.edge_followed_by.count)}
            **Following:** ${client.chill.fancyNumber(account.edge_follow.count)}
            **Private account:** ${account.is_private ? "Yes 🔐" : "Nope 🔓"}`);
        if (account.category_name !== null) profileEmbed.setDescription(account.category_name)

        const link = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Check it on Instagram')
                    .setStyle('LINK')
                    .setURL(`https://instagram.com/${name}/`)
            );
        return interaction.reply({embeds:[profileEmbed], components:[link]});
    }
}