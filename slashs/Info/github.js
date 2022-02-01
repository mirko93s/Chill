const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "github",
    description: "Get info about a Github repository",
    options: [
        {
            name: 'username',
            description: 'Username',
            type: 'STRING',
            required: true,
        },
        {
            name: 'repo',
            description: 'Repository name',
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {

        const username = interaction.options.getString('username');
        const repo = interaction.options.getString('repo');
        
        const res = await fetch(`https://api.github.com/repos/${username}/${repo}`);
        if (res.status !== 200) {
            const noResultEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ No result found for \`${username}\\${repo}\``)
            return interaction.reply({ephemeral:true, embeds:[noResultEmbed]});
        }
		const json = await res.json();

		const embed = new Discord.MessageEmbed()
			.setAuthor({name:json.owner.login, url:`https://github.com/${username}`})
            .setTitle(`/${repo}`)
            .setURL(`https://github.com/${json.full_name}`)
            .setDescription(json.description)
			.addField('⭐ Stars', `[${json.stargazers_count}](https://github.com/${json.full_name}/stargazers)`, true)
			.addField('⤵️ Forks', `[${json.forks_count}](https://github.com/${json.full_name}/network/members)`, true)
            .addField('👁️ Watchers', `[${json.subscribers_count}](https://github.com/${json.full_name}/watchers)`, true)
			.addField('Language', json.language || json?.parent.language, true)
            .addField('Created at', `<t:${Date.parse(json.created_at)/1e3}:R>`, true)
            .addField('Last update', `<t:${Date.parse(json.updated_at)/1e3}:R>`, true)
			.setThumbnail(json.owner.avatar_url)
			.setColor('RANDOM')
        if (json.topics.length > 0)    
            embed .addField('Tags', `\`${json.topics.join('` `')}\``, true)
        if (json.parent) embed.addField('Forked from', `[${json.parent.full_name}](https://github.com/${json.parent.full_name})`, true)

		interaction.reply({ embeds: [embed] });

    }
}