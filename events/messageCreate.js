const talkedRecently = new Set();

module.exports = async (client, msg) => {
    if (!msg.guild || msg.author.bot) return;
    prefix = client.settings.get(msg.guild.id, "prefix");
    //mention bot
    if (msg.mentions.has(client.user) && !msg.content.includes("@here") && !msg.content.includes("@everyone")) msg.reply(`Hi ${msg.author}! Type \`/help\` for more info! :smiley:`);
    //xp
    if (client.settings.get(msg.guild.id, "xpmodule") === "true" && msg.guild && !msg.content.startsWith(prefix) && !talkedRecently.has(msg.author.id) && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) {
        client.chill.xpAdd(client, msg, talkedRecently);
    }
    //old main
    if (!msg.content.startsWith(prefix) && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return;
    if (!msg.member) msg.member = await msg.guild.fetchMember(msg);
    //music-text-channel doesn't need .play command
    // if (msg.channel.id === client.settings.get(msg.guild.id, "musictextchannel") && !msg.content.startsWith(prefix)) {
    //     let cmdplay = client.commands.get("play");
    //     return cmdplay.run(client, msg, true);
    // }
    //commands stuff
    const arg = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = arg.shift().toLowerCase();
    //command handler
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        client.cmdstats.inc('usage',command.name);
        if (client.settings.includes(msg.guild.id, command.name, "disabledcommands")) return msg.channel.send({content: `\`${command.name}\` has been disabled on this server by an Administrator!`}).then(msg =>setTimeout(() => msg.delete(), 5000)); //check if command is disabled on the guild
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();
        command.run(client, msg, arg);
    }
    else { //custom command loader
        client.chill.checkCustomCommand(client, msg, cmd);
    }
};