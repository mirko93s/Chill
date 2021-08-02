const { fancyNumber, setupDatabases, ensureGuildSettings } = require("../functions.js");
const ascii = require("ascii-table");
const config = require('../config.json');
const package = require('../package.json');

module.exports = (client) => {

    console1337();
    //check if databases and their folders exist, if not create them
    setupDatabases(client);
    //define pm2 metrics
    const io = require('@pm2/io');
    var guilds_pm2_metric = io.metric({name: 'Guilds'});
    var users_pm2_metric = io.metric({name: 'Users'});
    var version_pm2_metric = io.metric({name: 'Version'});
    //get and format counters
    let users = client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0) - 1, 0);
    users = fancyNumber(users);
    let guilds = client.guilds.cache.size;
    guilds = fancyNumber(guilds);
    //ensure all guilds in the db
    client.guilds.cache.forEach(guild => {ensureGuildSettings(client, guild.id);});
    //set counters
    client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
    client.channels.cache.get(config.users_counter_channel).setName(`USERS: ${users}`);
    client.channels.cache.get(config.guilds_counter_channel).setName(`SERVERS: ${guilds}`);
    //set pm2 metrics
    guilds_pm2_metric.set(guilds);
    users_pm2_metric.set(users);
    version_pm2_metric.set(package.version);
    //update counters every 30 minutes
    setInterval(async () => { 
        users = client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0) - 1, 0)
        users = fancyNumber(users);
        guilds = client.guilds.cache.size;
        guilds = fancyNumber(guilds);
        client.channels.cache.get(config.users_counter_channel).setName(`USERS: ${users}`);
        client.channels.cache.get(config.guilds_counter_channel).setName(`SERVERS: ${guilds}`);
        guilds_pm2_metric.set(guilds);
        users_pm2_metric.set(users);
        await client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
        consolecounters(users, guilds);
    }, 30*60*1000);
};

function consolecounters (users, guilds) {
    let table = new ascii("Counters");
    table.setHeading("Type", "Number");
    table.addRow("Users", users);
    table.addRow("Guilds", guilds);
    console.log(table.toString());
}

function console1337 () {
    setTimeout(() => {console.log(`\n ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄                                      `);}, 100);
    setTimeout(() => {console.log(`▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌          ▐░▌                                       `);}, 200);
    setTimeout(() => {console.log(`▐░█▀▀▀▀▀▀▀▀▀ ▐░▌       ▐░▌ ▀▀▀▀█░█▀▀▀▀ ▐░▌          ▐░▌                                       `);}, 300);
    setTimeout(() => {console.log(`▐░▌          ▐░▌       ▐░▌     ▐░▌     ▐░▌          ▐░▌                                       `);}, 400);
    setTimeout(() => {console.log(`▐░▌          ▐░█▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░▌          ▐░▌                                       `);}, 500);
    setTimeout(() => {console.log(`▐░▌          ▐░░░░░░░░░░░▌     ▐░▌     ▐░▌          ▐░▌                    █████╗     ██████╗ `);}, 600);
    setTimeout(() => {console.log(`▐░▌          ▐░█▀▀▀▀▀▀▀█░▌     ▐░▌     ▐░▌          ▐░▌                   ██╔══██╗   ██╔═████╗`);}, 700);
    setTimeout(() => {console.log(`▐░▌          ▐░▌       ▐░▌     ▐░▌     ▐░▌          ▐░▌                   ╚██████║   ██║██╔██║`);}, 800);
    setTimeout(() => {console.log(`▐░█▄▄▄▄▄▄▄▄▄ ▐░▌       ▐░▌ ▄▄▄▄█░█▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄           ╚═══██║   ████╔╝██║`);}, 900);
    setTimeout(() => {console.log(`▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌          █████╔╝██╗╚██████╔╝`);}, 1000);
    setTimeout(() => {console.log(` ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀           ╚════╝ ╚═╝ ╚═════╝ `);}, 1100);
    setTimeout(() => {console.log(`┬─┐┌─┐┌─┐┌┬┐┬ ┬`);}, 1200);
    setTimeout(() => {console.log(`├┬┘├┤ ├─┤ ││└┬┘`);}, 1300);
    setTimeout(() => {console.log(`┴└─└─┘┴ ┴─┴┘ ┴ \n`);}, 1400);
}