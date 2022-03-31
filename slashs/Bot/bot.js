const Discord = require(`discord.js`);
const os = require(`os`);
const cpuStat = require(`cpu-stat`);
const package = require(`../../package.json`);
const ms = require(`ms`);
const { stripIndent } = require(`common-tags`);

module.exports = {
	name: `bot`,
	description: `Shows some bot statistics`,
	options: null,
	run: async (client, interaction, LANG) => {

		cpuStat.usagePercent(function(err, percent, seconds) {
			if (err) {
				return console.log(err);
			}

			const counters = stripIndent`
            Guilds    :: ${Math.ceil(client.guilds.cache.size)}
            Users     :: ${client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0) - 1, 0)}
            Channels  :: ${client.channels.cache.size}
        `;

			const versions = stripIndent`
            Bot        :: ${package.version}
            Discord.js :: ${package.dependencies[`discord.js`]}
            Node.js    :: ${process.version}
        `;

			const system = stripIndent`
            CPU       :: ${os.cpus().map(i => `${i.model.replace(/cpu|apu|\(tm\)|\(r\)|core|with|radeon|hd|graphics/gi, ``)}`)[0]}
            Cores     :: ${cpuStat.totalCores()}
            CPU Usage :: ${percent.toFixed(2)} %
            RAM Usage :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem() / 1024 / 1024)} MB
            OS        :: ${os.platform()} ${os.release} ${os.arch()}
            Uptime    :: ${ms(process.uptime().toFixed() * 1e3)}
        `;

			const embed = new Discord.MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setColor(`RANDOM`)
				.setThumbnail(client.user.avatarURL())
				.addField(LANG.created_at, `<t:${(client.user.createdTimestamp / 1e3).toFixed(0)}>`, false)
				.addField(LANG.counters, `\`\`\`asciidoc\n${counters}\`\`\``, true)
				.addField(LANG.versions, `\`\`\`asciidoc\n${versions}\`\`\``, true)
				.addField(LANG.system, `\`\`\`asciidoc\n${system}\`\`\``, false)
				.setTimestamp()
				.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

			client.chill.buttonLinks(interaction, embed);
		});
	},
};
