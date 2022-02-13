/**
 * 
 * @param {Client} client 
 * @description create databases files and databases directories if they don't exist
 */
module.exports = function (client) {
    const fs = require("fs");
    const Enmap = require('enmap');
    //check if folders exist
    const dir_databases = './databases';
    if (!fs.existsSync(dir_databases)) fs.mkdirSync(dir_databases);
    const dir_guild_settings = './databases/guild_settings';
    if (!fs.existsSync(dir_guild_settings)) fs.mkdirSync(dir_guild_settings);
    const dir_command_stats = './databases/command_stats';
    if(!fs.existsSync(dir_command_stats)) fs.mkdirSync(dir_command_stats);
    const dir_intervals = './databases/intervals';
    if(!fs.existsSync(dir_intervals)) fs.mkdirSync(dir_intervals);
    // guild settings enmap
    client.settings = new Enmap({
        name: "settings",
        fetchAll: true,
        autoFetch: true,
        cloneLevel: 'deep',
        dataDir: './databases/guild_settings'
    });
    // command stats enmap
    client.cmdstats = new Enmap({
        name: "cmdstats",
        fetchAll: true,
        autoFetch: true,
        cloneLevel: 'deep',
        dataDir: './databases/command_stats'
    });
    // intervals enmap
    client.intervals = new Enmap({
        name: "intervals",
        fetchAll: true,
        autoFetch: true,
        cloneLevel: 'deep',
        dataDir: './databases/intervals'
    });
    client.intervals.ensure('reminders',{});
    client.intervals.ensure('giveaways',{});
    client.cmdstats.ensure('disabled',[]);
}
