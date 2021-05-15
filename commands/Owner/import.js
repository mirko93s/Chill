const Discord = require("discord.js");
const fs = require("fs");
const Enmap = require('enmap');
const config = require('../../config.json');

module.exports = {
    name: "import",
    category: "_",
    description: "_",
    usage: "_",
    permission: "_",
    run: async (client, msg, arg) => {

        if (msg.author.id !== config.bot_owner) return;

        //check if folders exist
        var dir_databases = '././databases';
        if (!fs.existsSync(dir_databases)) fs.mkdirSync(dir_databases);
        var dir_xp = '././databases/xp';
        if (!fs.existsSync(dir_xp)) fs.mkdirSync(dir_xp);

        var xp = new Enmap({
            name: "xp",
            fetchAll: true,
            autoFetch: true,
            cloneLevel: 'deep',
            dataDir: '././databases/xp'
        });

        var total = 0;
        var imported = 0;
        var noguild = 0;
        var nouser = 0;

        console.log("importing....");
        xp.forEach(data => {
            total++;
            if (client.guilds.cache.has(data.guild)) {
                if (client.guilds.cache.get(data.guild).member(data.user)) {
                    imported++;
                    client.settings.set(data.guild, {level: data.level, points: data.points}, `xp.${data.user}`);
                } else nouser++;
            } else noguild++;
        });

        console.log("total keys: "+total);
        console.log("imported: "+imported);
        console.log("no guild: "+noguild);
        console.log("no user: "+nouser);

        







    }
}
