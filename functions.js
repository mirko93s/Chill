const Discord = require("discord.js");
const config = require('./config.json');

module.exports = {
    getMember: function(msg, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = msg.guild.members.cache.get(toFind);
        
        if (!target && msg.mentions.members)
            target = msg.mentions.members.first();

        if (!target && toFind) {
            target = msg.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
            
        if (!target) 
            target = msg.member;
            
        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },

    promptMessage: async function (msg, author, time, validReactions) {

        time *= 1000;
        for (const reaction of validReactions) await msg.react(reaction); //add reactions in order
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
        return msg
            .awaitReactions({filter,  max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    setupCheck: function(client, msg) {
        let welcomechannel = msg.guild.channels.cache.find(welcomechannel => welcomechannel.id === (client.settings.get(msg.guild.id, "welcomechannel")));
        let bcchannel = msg.guild.channels.cache.find(bcchannel => bcchannel.id === (client.settings.get(msg.guild.id, "bcchannel")));
        let puchannel = msg.guild.channels.cache.find(puchannel => puchannel.id === (client.settings.get(msg.guild.id, "puchannel")));
        let reportchannel = msg.guild.channels.cache.find(reportchannel => reportchannel.id === (client.settings.get(msg.guild.id, "reportchannel")));
        let gachannel = msg.guild.channels.cache.find(gachannel => gachannel.id === (client.settings.get(msg.guild.id, "gachannel")));
        let pollchannel = msg.guild.channels.cache.find(pollchannel => pollchannel.id === (client.settings.get(msg.guild.id, "pollchannel")));
        let musicvocalchannel = msg.guild.channels.cache.find(musicvocalchannel => musicvocalchannel.id === (client.settings.get(msg.guild.id, "musicvocalchannel")));
        let musictextchannel = msg.guild.channels.cache.find(musictextchannel => musictextchannel.id === (client.settings.get(msg.guild.id, "musictextchannel")));
        let ticketcategory = msg.guild.channels.cache.find(ticketcategory => ticketcategory.id === (client.settings.get(msg.guild.id, "ticketcategory")));
        let musictemprole = msg.guild.roles.cache.find(musictemprole => musictemprole.id === (client.settings.get(msg.guild.id, "musictemprole")));
        let mutedrole = msg.guild.roles.cache.find(mutedrole => mutedrole.id === (client.settings.get(msg.guild.id, "mutedrole")));
        let djrole = msg.guild.roles.cache.find(djrole => djrole.id === (client.settings.get(msg.guild.id, "djrole")));
        let supportrole = msg.guild.roles.cache.find(supportrole => supportrole.id === (client.settings.get(msg.guild.id, "supportrole")));
        let roleonjoin = msg.guild.roles.cache.find(roleonjoin => roleonjoin.id === (client.settings.get(msg.guild.id, "roleonjoin")));	
        if(!bcchannel || !puchannel || !reportchannel || !gachannel || !pollchannel|| !mutedrole || !djrole || !welcomechannel || !musicvocalchannel || !musictextchannel || !ticketcategory || !musictemprole || !supportrole || !roleonjoin)
            return false;
        else return true;
    },

    xpAdd: function(client, msg, talkedRecently) {
        client.settings.ensure(msg.guild.id, {level: 0, points: 0}, `xp.${msg.author.id}`);
        client.settings.inc(msg.guild.id, `xp.${msg.author.id}.points`);
        const curLevel = Math.floor(0.3163 * Math.sqrt(client.settings.get(msg.guild.id, `xp.${msg.author.id}.points`)));
        if (client.settings.get(msg.guild.id, `xp.${msg.author.id}.level`) < curLevel) { //level up
            client.settings.set(msg.guild.id, curLevel, `xp.${msg.author.id}.level`);
			const newlevelembed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setAuthor(`Congratulations`, msg.author.avatarURL())
                .setDescription(`${msg.member.user} **leveled up to Lvl ${curLevel}**!`)
            //check rewards
            var rewards = client.settings.get(msg.guild.id, `rewards`);
            var unlocked = "";
            for (const [key, value] of Object.entries(rewards)) {
                if (value == curLevel) {
                    const checkrole = msg.guild.roles.cache.find(r => r.id === key); //check if role exists
                    if (checkrole && msg.guild.me.roles.highest.position > checkrole.rawPosition) msg.member.roles.add(checkrole.id); //give role
                    unlocked += `${msg.guild.roles.cache.find(r => r.id === key).name}\n`;
                }
            };
            if (unlocked.length > 0) newlevelembed.setDescription(`${msg.member.user} **leveled up to Lvl ${curLevel}**\n*and unlocked these roles:*\n***${unlocked}***`)
            msg.channel.send({embeds:[newlevelembed]});
        };
        talkedRecently.add(msg.author.id); //xp cooldown
        setTimeout(() => {
            talkedRecently.delete(msg.author.id);
        }, client.settings.get(msg.guild.id, "xpcooldown")*1000);
    },

    dmOwnerOnJoin: function(client, guild) {
        const dmonweronjoinEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setAuthor(`Chill - Discord Bot`)
            .setURL(`https://www.mirko93s.it/`)
            .setThumbnail(client.user.avatarURL())
            .setTitle(`Thanks for inviting my bot!`)
            .setDescription(`⚠️ Follow the instructions to setup the Bot (Don't skip them!) ⚠️
            \n1️⃣ **Type .showconfig** \n> You can check the default settings in there.
            \n2️⃣ **Rename channels and roles**\n > Rename the channels and the roles you see in the config as you prefer, they are saved in the config using their id, so you can rename them at any time and they will still be linked to the config.
            \n3️⃣ **Other settings**\n> Check and set **Other** and **Toggles** sections as you prefer, you can disable features you don't want such xp system, welcome messages and more. If you want to get back to default, type .resetconfig.
            \n4️⃣ **Set your role hierarchy**\n> **Chill** (bot) role must be just below the owner/admin role.\n> **Muted** role must be above any other role that your members will get.
            \n5️⃣ **Music**\n> Don't forget to give **DJ** role to your members to make sure they can use Music commands.\n> If you will use "Music Only Channel" a hidden text channel will only be shown to people who are connected to the Music Vocal Channel and music commands will only work on the "Music Text Channel".
            \n6️⃣ **Mute command**\n> You might need to adjust channel permissions to avoid that "Muted" members can still send messages, depending on how your server has been set.
            \n7️⃣ **Deleted Config Keys**\n> If you accidentally delete a bot's channel or role it will appear as "NOT FOUND" in .showconfig, to fix and create the missing keys of the config type .setup. This will create the missing/deleted channels and roles, or use .setconfig to manually link and existing channel/role to the config.
            \n
            \n**TL;DR**\n> You can now rename all the channels and roles the bot has just created, check them by doing .showconfig. Put Muted role above any other role that normal members can get, give DJ role to users. Do .setup if you accidentally deleted a bot's channel/role.
            \n
            \n*P.S. If you wish to use the same channel/role for multiple scopes use .setconfig*
            `)
            .setFooter(`©️ 2019-2021 mirko93s`,`https://cdn.discordapp.com/avatars/278380909588381698/029d0578df3fa298132b3d85dd06bf3c.png?size=128`)
	    guild.fetchOwner().then(o => {
            try {
                o.send({embeds:[dmonweronjoinEmbed]});
            } catch (error) {
                return;
            }
        });
    },

    welcomeMessage: function(member, guild) {
        let count = guild.memberCount.toString();
        if (count.endsWith("1") === true) count += "st";
            else if (count.endsWith("2") === true) count += "nd";
                else if (count.endsWith("3") === true) count += "rd";
                    else count += "th";
        var message = [
            `${member.user} has joined.`,
            `${member.user} joined ${guild.name}.`,
            `Welcome, ${member.user}.`,
            `${member.user} is our 1,000,000th visitor. React for a free IPhone.`,
            `Let's all give a warm welcome to ${member.user}.`,
            `Wild ${member.user} appeared!`,
            `👋 ${member.user} 👋`,
            `Welcome ${member.user}, you are the ${count} member.`,
            `Hi ${member.user}, hope you will enjoy staying in our server. `,
            `Hello ${member.user}, we were expecting you.`,
            `●●●${member.user} is typing...`
        ];
        const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(message[Math.floor(Math.random() * message.length)])
            
        return welcomeEmbed;
    },

    setupGuildOnJoin: async function(client, guild) {
        //roles
        await guild.roles.create({ name: "Listening",permissions: [], color: 'CCCC00'})
            .then(role => {client.settings.set(guild.id, role.id, "musictemprole")});
        guild.roles.create({ name: "Muted",permissions: [],color: '525252'})
            .then(role => {client.settings.set(guild.id, role.id, "mutedrole")});
        guild.roles.create({ name: "DJ",permissions: ['CONNECT'], color: 'D00091'})
            .then(role => {client.settings.set(guild.id, role.id, "djrole")});
        guild.roles.create({ name: "Support",permissions: [], color: 'FC72F3'})
            .then(role => {client.settings.set(guild.id, role.id, "supportrole")});
        guild.roles.create({ name: "Member",permissions: ['VIEW_CHANNEL'], color: '33FFFF'})
            .then(role => {client.settings.set(guild.id, role.id, "roleonjoin")});
        //channels
        guild.channels.create("🎫tickets", {type: 'GUILD_CATEGORY'})
            .then(channel => {client.settings.set(guild.id, channel.id, "ticketcategory")});
        guild.channels.create("👋welcome", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "welcomechannel")});
        guild.channels.create("🔴broadcast", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "bcchannel")});
        guild.channels.create("🔨punishments", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "puchannel")});
        guild.channels.create("🚨reports", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: [`VIEW_CHANNEL`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "reportchannel")});
        guild.channels.create("🎉giveaway", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "gachannel")});
        guild.channels.create("💡poll", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "pollchannel")});
        guild.channels.create("🔊music", {type: 'GUILD_VOICE',
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SPEAK']}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "musicvocalchannel")});
        guild.channels.create("🎵song-request", {type: 'GUILD_TEXT', 
            permissionOverwrites: [
            {id: guild.roles.everyone.id, 
            deny: ['VIEW_CHANNEL']},
            {id: client.settings.get(guild.id, "musictemprole"),
            allow: ['VIEW_CHANNEL','SEND_MESSAGES']}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "musictextchannel")});
    },

    fancyNumber: function (number) {
        let formatted = number;
        if (number >= 10**3) {
            const suffix = ['K','M','B','T'];
            var selector = -1;    
            do {
                formatted /= 10**3;
                selector++;
            } while (formatted >= 10**3);
            formatted = `${parseFloat(number/10**((selector+1)*3)).toFixed(1)}${suffix[selector] !== undefined ? ` ${suffix[selector]}` : `e${(selector+1)*3}`}`;
        }
        return formatted;
    },

    setupDatabases: function (client) {
        const fs = require("fs");
        const Enmap = require('enmap');
        //check if folders exist
        var dir_databases = './databases';
        if (!fs.existsSync(dir_databases)) fs.mkdirSync(dir_databases);
        var dir_guild_settings = './databases/guild_settings';
        if (!fs.existsSync(dir_guild_settings)) fs.mkdirSync(dir_guild_settings);
        //create enmaps
        client.settings = new Enmap({
            name: "settings",
            fetchAll: true,
            autoFetch: true,
            cloneLevel: 'deep',
            dataDir: './databases/guild_settings'
        });
    },

    checkCustomCommand: function (client, msg, cmd) {
        if(client.settings.has(msg.guild.id, `customcmd.${cmd}`)) {
            if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();
            const customEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setDescription(client.settings.get(msg.guild.id, `customcmd.${cmd}`))
            msg.channel.send({embeds:[customEmbed]});
        }
    },

    ensureGuildSettings: function (client, guild) {
            const defaultSettings = {
                prefix: ".",
                musicchannelonly: "false",
                xpcooldown: 5,
                autodeletecmds: "true",
                xpmodule: "true",
                welcomemessage: "true",
                welcomerole: "true",
                djrequired: "true",
                autovocalchannels: [],
                autovocalcloned: [],
                disabledcommands: [],
                xp: {},
                customcmd: {},
                rewards: {}
            }
            client.settings.ensure(guild, defaultSettings);
    },

    updateServerStats: function (client, member) {
        if (client.serverstatscooldown.has(member.guild.id)) return;
		const usercounterchannel = member.guild.channels.cache.find(c => c.id === (client.settings.get(member.guild.id, "usercounter"))); //check if channel still exists
		if (usercounterchannel) {
			var memberCount = member.guild.members.cache.filter(member => !member.user.bot).size;
            const fancyNumber = require('./functions').fancyNumber;
            memberCount = fancyNumber(memberCount);
			usercounterchannel.setName(`📊Users: ${memberCount}`);
			client.serverstatscooldown.add(member.guild.id); //xp cooldown
            setTimeout(() => {
                client.serverstatscooldown.delete(member.guild.id);
            }, 15*60*1000);
		} else { //if channel doesnt exist delete usercounter from db disabling the feature
			client.settings.delete(member.guild.id, "usercounter");
		}
    },

    buttonLinks: async function (msg, embed) {
        const links = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Invite')
                    .setStyle('LINK')
                    .setURL(config.bot_invite_link)
                    .setEmoji('😃'),
                new Discord.MessageButton()
                    .setLabel('Vote')
                    .setStyle('LINK')
                    .setURL(config.bot_vote_link)
                    .setEmoji('💜'),
                new Discord.MessageButton()
                    .setLabel('Github')
                    .setStyle('LINK')
                    .setURL(config.bot_project_link),
                    // .setEmoji('🧬'),
                new Discord.MessageButton()
                    .setLabel('Website')
                    .setStyle('LINK')
                    .setURL(config.bot_website_link)
                    // .setEmoji('🔗'),
            );
        return msg.channel.send({embeds:[embed],components:[links]});
    }
};