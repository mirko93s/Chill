const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    description: "Report a member for breaking the rules (also available right-clicking a message)",
    botPerms: ['VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS'],
    options: [
        {
            name: 'user',
            description: 'User to report',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Why are you reporting this user?',
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {
        report(client, interaction, interaction.options.getMember('user'));
    }
}

module.exports.message = {
    name: 'Report',
    type: 'MESSAGE',
    botPerms: ['VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS'],
    contextdescription: 'Report a message (and its author) for breaking the rules',
    run: async (client, interaction, arg) => {
        interaction.guild.members.fetch(interaction.targetMessage.author.id).then(reported => {
            report(client, interaction, reported, true);
        })
    }
}

async function report(client, interaction, reported, isMessage = false) {

    const nochannelEmbed = new Discord.MessageEmbed()
        .setColor(`RED`)
        .setTitle(`⛔ Reports channel not found`)
    const nobotEmbed = new Discord.MessageEmbed()
        .setColor(`RED`)
        .setTitle(`⛔ You can't report bots`)
    const notSelfEmbed = new Discord.MessageEmbed()
        .setColor(`RED`)
        .setTitle(`⛔ You can't report yourself`)
    const thanksEmbed = new Discord.MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`✅ Thanks for reporting this user.\nA staff member will review your report as soon as possible`)
    const tooLongEmbed = new Discord.MessageEmbed()
        .setColor(`RED`)
        .setTitle(`⛔ Description must be shorter than 3072 characters`)

        if (reported.user.bot) return interaction.reply({ephemeral:true, embeds:[nobotEmbed]});
        if (reported.user.id === interaction.user.id) return interaction.reply({ephemeral:true, embeds:[notSelfEmbed]});

        if (interaction.options.getString('reason')?.length > 3072) return interaction.reply({ephemeral:true, embeds:[tooLongEmbed]});

        let reportchannel = interaction.guild.channels.cache.find(reportchannel => reportchannel.id === (client.settings.get(interaction.guild.id, "reportchannel")));
        if (!reportchannel) return interaction.reply({ephemeral:true, embeds:[nochannelEmbed]});

        interaction.reply({ephemeral:true, embeds:[thanksEmbed]});

        const reportEmbed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
        
        if(!isMessage) {
            reportEmbed
                .setAuthor({name: "User Report", iconURL: reported.user.displayAvatarURL()})
                .setDescription(stripIndents`**Member:**
                > ${reported} \`${reported.user.id}\`
                **Reported by:**
                > ${interaction.member}
                **Channel:**
                > ${interaction.channel}
                **Reason:**
                > ${interaction.options.getString('reason')}`);
        } else {
            reportEmbed
                .setAuthor({name: "Message Report", iconURL: reported.user.displayAvatarURL()})
                .setDescription(stripIndents`**Message author:**
                > ${reported} \`${reported.user.id}\`
                **Reported by:**
                > ${interaction.member}
                **Channel:**
                > ${interaction.channel}
                **Message:**
                > [LINK](https://discord.com/channels/${interaction.targetMessage.guildId}/${interaction.targetMessage.channelId}/${interaction.targetMessage.id}/)`);

                if (interaction.targetMessage.content.length > 1e3) reportEmbed.addField('Message Preview', interaction.targetMessage.content.slice(0,1e3) + `\n\`+${(interaction.targetMessage.content.length - 1e3).toString()} characters\``);
                else reportEmbed.addField('Message Preview', interaction.targetMessage.content);
        }
        reportchannel.send({embeds:[reportEmbed]});
}